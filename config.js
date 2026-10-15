/*
 * Общий рейтинг на Firebase (Firestore + анонимный вход), без SDK: только fetch.
 * Настройка: ключи в config.js, правила из firestore.rules (см. README.md).
 *
 * window.LB = {
 *   enabled              — true, если в config.js заполнены apiKey и projectId
 *   top(n)               — Promise<[{id, name, best}]>, лучшие n игроков
 *   mine()               — Promise<{id, name, best, rank} | null>, запись и место текущего игрока
 *   submit(best, name)   — Promise, записывает рекорд текущего игрока
 *   uid()                — id текущего игрока или null, пока он ни разу не отправлял результат
 * }
 */
(function () {
  'use strict';

  var cfg = (window.BASHNYA_CONFIG && window.BASHNYA_CONFIG.firebase) || {};
  var KEY = cfg.apiKey || '';
  var PID = cfg.projectId || '';
  var enabled = !!(KEY && PID);
  var DOCS = 'https://firestore.googleapis.com/v1/projects/' + encodeURIComponent(PID) + '/databases/(default)/documents';
  var AUTH_KEY = 'bashnya-auth';

  var auth = null;
  try { auth = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch (e) { auth = null; }
  var pending = null;

  function saveAuth() {
    try { localStorage.setItem(AUTH_KEY, JSON.stringify(auth)); } catch (e) {}
  }

  function setAuth(uid, refreshToken, idToken, expiresIn) {
    auth = {
      uid: uid,
      refreshToken: refreshToken,
      idToken: idToken,
      exp: Date.now() + (parseInt(expiresIn, 10) || 3600) * 1000
    };
    saveAuth();
    return auth.idToken;
  }

  function request(url, opts) {
    return fetch(url, opts).then(function (res) {
      return res.text().then(function (text) {
        var body = null;
        try { body = text ? JSON.parse(text) : null; } catch (e) {}
        if (!res.ok) {
          var err = new Error('HTTP ' + res.status);
          err.status = res.status;
          err.body = body;
          throw err;
        }
        return body;
      });
    });
  }

  function signUp() {
    return request('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + encodeURIComponent(KEY), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnSecureToken: true })
    }).then(function (r) {
      return setAuth(r.localId, r.refreshToken, r.idToken, r.expiresIn);
    });
  }

  function refresh() {
    return request('https://securetoken.googleapis.com/v1/token?key=' + encodeURIComponent(KEY), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(auth.refreshToken)
    }).then(function (r) {
      return setAuth(r.user_id, r.refresh_token, r.id_token, r.expires_in);
    }, function (e) {
      // Токен отозван или недействителен: заводим нового анонимного игрока.
      if (e && e.status === 400) { auth = null; return signUp(); }
      throw e;
    });
  }

  function token() {
    if (auth && auth.idToken && auth.exp - Date.now() > 60000) return Promise.resolve(auth.idToken);
    if (!pending) {
      pending = (auth && auth.refreshToken ? refresh() : signUp()).then(function (t) {
        pending = null;
        return t;
      }, function (e) {
        pending = null;
        throw e;
      });
    }
    return pending;
  }

  function top(n) {
    if (!enabled) return Promise.reject(new Error('disabled'));
    return request(DOCS + ':runQuery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'scores' }],
          orderBy: [{ field: { fieldPath: 'best' }, direction: 'DESCENDING' }],
          limit: n
        }
      })
    }).then(function (list) {
      var rows = [];
      (list || []).forEach(function (item) {
        var d = item && item.document;
        if (!d || !d.fields) return;
        var best = parseInt(d.fields.best && d.fields.best.integerValue, 10);
        if (!(best > 0)) return;
        rows.push({
          id: String(d.name).split('/').pop(),
          name: (d.fields.name && d.fields.name.stringValue) || '',
          best: best
        });
      });
      return rows;
    });
  }

  // Место игрока: число игроков с результатом строго выше, плюс один.
  function rankOf(best) {
    return request(DOCS + ':runAggregationQuery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredAggregationQuery: {
          structuredQuery: {
            from: [{ collectionId: 'scores' }],
            where: {
              fieldFilter: {
                field: { fieldPath: 'best' },
                op: 'GREATER_THAN',
                value: { integerValue: String(best) }
              }
            }
          },
          aggregations: [{ alias: 'n', count: {} }]
        }
      })
    }).then(function (res) {
      var n = 0;
      (res || []).forEach(function (item) {
        var f = item && item.result && item.result.aggregateFields;
        if (f && f.n) n = parseInt(f.n.integerValue, 10) || 0;
      });
      return n + 1;
    });
  }

  function mine() {
    if (!enabled || !auth || !auth.uid) return Promise.resolve(null);
    var uid = auth.uid;
    return request(DOCS + '/scores/' + encodeURIComponent(uid)).then(function (d) {
      var f = d && d.fields;
      var best = parseInt(f && f.best && f.best.integerValue, 10);
      if (!(best > 0)) return null;
      var name = (f.name && f.name.stringValue) || '';
      return rankOf(best).then(function (rank) {
        return { id: uid, name: name, best: best, rank: rank };
      });
    }, function (e) {
      if (e && e.status === 404) return null;
      throw e;
    });
  }

  function submit(best, name) {
    if (!enabled) return Promise.reject(new Error('disabled'));
    return token().then(function (tok) {
      var url = DOCS + '/scores/' + encodeURIComponent(auth.uid) +
        '?updateMask.fieldPaths=best&updateMask.fieldPaths=name&updateMask.fieldPaths=t';
      return request(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tok },
        body: JSON.stringify({
          fields: {
            best: { integerValue: String(Math.floor(best)) },
            name: { stringValue: String(name || '').slice(0, 16) },
            t: { integerValue: String(Date.now()) }
          }
        })
      });
    });
  }

  window.LB = {
    enabled: enabled,
    top: top,
    mine: mine,
    submit: submit,
    uid: function () { return auth ? auth.uid : null; }
  };
})();
