<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#0d1220">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>Башня</title>
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/icon-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;700&family=Unbounded:wght@500;700&display=swap">
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="app">
  <div class="hud">
    <div class="stat"><span class="label">Этажей</span><span class="num" id="score">0</span></div>
    <div class="stat mid"><span class="label">Монеты</span><span class="num" id="coins">0</span></div>
    <div class="stat right"><span class="label">Рекорд</span><span class="num" id="best">0</span></div>
  </div>
  <div class="stage" id="stage">
    <canvas id="cv"></canvas>
    <div class="overlay" id="menu">
      <div class="card">
        <h1>Башня</h1>
        <p>Нажимай в экран, когда блок над башней. Всё, что выступает, обрезается. Попадёшь точно, и башня не сузится.</p>
        <button id="playBtn" type="button">Играть</button>
        <div class="btnrow">
          <button id="shopBtn" class="ghost" type="button">Магазин</button>
          <button id="lbBtn" class="ghost" type="button">Лидеры</button>
        </div>
      </div>
    </div>
    <div class="overlay" id="over" hidden>
      <div class="card">
        <h1>Башня упала</h1>
        <p id="ovText"></p>
        <p class="stats" id="ovStats"></p>
        <p class="record" id="ovRecord" hidden>Новый рекорд!</p>
        <button id="againBtn" type="button">Ещё раз</button>
        <div class="btnrow">
          <button id="overShopBtn" class="ghost" type="button">Магазин</button>
          <button id="overMenuBtn" class="ghost" type="button">В меню</button>
        </div>
      </div>
    </div>
    <div class="overlay" id="pause" hidden>
      <div class="card">
        <h1>Пауза</h1>
        <p>Если выйти в меню, попытка закончится. Монеты и рекорд сохранятся.</p>
        <button id="resumeBtn" type="button">Продолжить</button>
        <button id="pauseMenuBtn" class="ghost" type="button">В меню</button>
      </div>
    </div>
    <button id="pauseBtn" class="pausebtn" type="button" hidden>Меню</button>
    <div class="overlay shop" id="shop" hidden>
      <div class="card wide">
        <h1>Магазин</h1>
        <p class="bal">Монет: <strong id="shopCoins">0</strong></p>
        <div class="tabs" id="shopTabs">
          <button class="tab on" data-tab="up" type="button">Прокачки</button>
          <button class="tab" data-tab="skin" type="button">Блоки</button>
          <button class="tab" data-tab="bg" type="button">Фоны</button>
        </div>
        <div class="shop-list" id="shopList"></div>
        <button id="shopBack" type="button">Назад</button>
      </div>
    </div>
    <div class="overlay shop" id="lb" hidden>
      <div class="card wide">
        <div class="lbhead"><h1>Лидеры</h1><button id="lbRefresh" class="ghost small" type="button">Обновить</button></div>
        <div class="board" id="lbList"></div>
        <div class="lbme" id="lbMe"></div>
        <div class="note" id="lbNote" hidden></div>
        <label class="field" for="nick"><span class="label">Твоё имя в рейтинге</span><input id="nick" type="text" maxlength="16" autocomplete="off" placeholder="Игрок"></label>
        <button id="lbBack" type="button">Назад</button>
      </div>
    </div>
  </div>
</div>
<script src="config.js"></script>
<script src="leaderboard.js"></script>
<script src="game.js"></script>
<script>
if ('serviceWorker' in navigator && !window.Capacitor && location.protocol.indexOf('http') === 0) {
  navigator.serviceWorker.register('sw.js').catch(function () {});
}
</script>
</body>
</html>
