/* Layout: one-screen game. Stat row on top, canvas stage fills the rest, overlay card for start / game over. */
:root {
  color-scheme: dark;
  --bg: #0d1220;
  --panel: #151c30;
  --fg: #e8edfb;
  --muted: #8d9bbd;
  --accent: #ffc857;
  --accent-ink: #1a1405;
  --scrim: rgba(8, 11, 22, 0.66);
  --scrim-strong: rgba(8, 11, 22, 0.88);
  --row: rgba(255, 255, 255, 0.07);
  --font-display: "Unbounded", "Arial Black", system-ui, sans-serif;
  --font-body: "Manrope", system-ui, -apple-system, "Segoe UI", sans-serif;
}
html, body { height: 100%; }
body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-body);
  font-size: 15px;
  padding-left: max(16px, env(safe-area-inset-left, 0px));
  padding-right: max(16px, env(safe-area-inset-right, 0px));
  padding-block: 12px;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}
.app {
  height: 100%;
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.hud { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; }
.stat { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.stat.right { align-items: flex-end; }
.label { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); font-weight: 700; }
.num { font-family: var(--font-display); font-weight: 700; font-size: 34px; line-height: 1; font-variant-numeric: tabular-nums; }
.stat.right .num { font-size: 22px; color: var(--muted); }
.stage {
  position: relative;
  flex: 1;
  min-height: 0;
  border-radius: 16px;
  overflow: hidden;
  background: var(--panel);
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}
canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.overlay {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  background: var(--scrim);
}
.card {
  width: 100%; max-width: 320px;
  display: flex; flex-direction: column; gap: 14px;
  text-align: left;
}
.card h1 { margin: 0; font-family: var(--font-display); font-weight: 700; font-size: 38px; line-height: 1.05; text-wrap: balance; }
.card p { margin: 0; color: var(--muted); line-height: 1.5; max-width: 34ch; }
.card .stats { color: var(--fg); font-weight: 700; font-variant-numeric: tabular-nums; }
.card .record { color: var(--accent); font-weight: 700; }
button {
  font-family: var(--font-body); font-weight: 700; font-size: 17px;
  background: var(--accent); color: var(--accent-ink);
  border: 0; border-radius: 12px; padding: 15px 20px;
  cursor: pointer; align-self: stretch;
}
button:active { transform: translateY(1px); }
button:focus-visible { outline: 3px solid var(--fg); outline-offset: 3px; }
.ghost { background: transparent; color: var(--fg); border: 1.5px solid var(--muted); }
.stat.mid .num { font-size: 22px; color: var(--accent); }
.shop { background: var(--scrim-strong); }
.card.wide { max-width: 360px; max-height: 100%; }
.shop h1 { font-size: 28px; }
.bal strong { color: var(--accent); font-variant-numeric: tabular-nums; }
.shop-list { display: flex; flex-direction: column; gap: 10px; overflow-y: auto; touch-action: pan-y; min-height: 0; }
.up { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px; align-items: center; padding: 12px; border-radius: 12px; background: var(--row); }
.up .nm { font-weight: 700; }
.up .lv { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); font-weight: 700; margin-top: 3px; }
.up .ds { color: var(--muted); font-size: 13px; line-height: 1.4; margin-top: 4px; }
.buy { min-width: 92px; padding: 10px 14px; font-size: 15px; align-self: center; font-variant-numeric: tabular-nums; }
.buy:disabled { background: transparent; color: var(--muted); border: 1.5px solid var(--muted); opacity: 0.6; cursor: default; }
.btnrow { display: flex; gap: 10px; }
.btnrow button { flex: 1; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field input { font-family: var(--font-body); font-size: 16px; font-weight: 700; color: var(--fg); background: var(--row); border: 1.5px solid transparent; border-radius: 10px; padding: 12px; min-width: 0; }
.field input:focus-visible { outline: none; border-color: var(--accent); }
.board { display: flex; flex-direction: column; gap: 6px; overflow-y: auto; touch-action: pan-y; min-height: 0; }
.lb { display: grid; grid-template-columns: 28px minmax(0, 1fr) auto; gap: 10px; align-items: center; padding: 10px 12px; border-radius: 10px; background: var(--row); font-variant-numeric: tabular-nums; }
.lb.me { outline: 1.5px solid var(--accent); }
.lb .rk { color: var(--muted); font-weight: 700; }
.lb:first-child .rk { color: var(--accent); }
.lb .pn { font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lb .pf { font-family: var(--font-display); font-weight: 700; }
.note { color: var(--muted); font-size: 13px; line-height: 1.4; }
.tabs { display: flex; gap: 6px; }
.tab { flex: 1; padding: 9px 4px; font-size: 14px; background: var(--row); color: var(--muted); border-radius: 10px; }
.tab.on { background: var(--fg); color: var(--bg); }
.info.withsw { display: flex; gap: 12px; align-items: center; min-width: 0; }
.info .txt { min-width: 0; }
.sw { flex: none; border-radius: 8px; }
.sw.bgsw { width: 44px; height: 44px; }
.sw.blsw { width: 52px; height: 30px; border-radius: 4px; }
.pausebtn {
  position: absolute; top: 10px; right: 10px; z-index: 2;
  padding: 8px 16px; font-size: 13px; border-radius: 999px;
  background: rgba(8, 11, 22, 0.55); color: var(--fg);
  border: 1px solid rgba(255, 255, 255, 0.28);
  align-self: auto;
}
.lbhead { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.lbhead h1 { margin: 0; }
.small { padding: 8px 14px; font-size: 14px; align-self: auto; flex: none; }
.small:disabled { opacity: 0.5; cursor: default; }
.lb.r1 .rk { color: #ffc857; }
.lb.r2 .rk { color: #c9d3e6; }
.lb.r3 .rk { color: #e29a62; }
.lbme:empty { display: none; }
.lbme .lb { background: rgba(255, 200, 87, 0.12); }

/* Standalone reset (the Claude page wrapper used to provide this) */
*, *::before, *::after { box-sizing: border-box; }
html {
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background: var(--bg);
  overscroll-behavior: none;
}
body { margin: 0; overscroll-behavior: none; -webkit-touch-callout: none; }
[hidden] { display: none !important; }

