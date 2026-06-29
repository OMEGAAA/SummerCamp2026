const { app, BrowserWindow, Menu, shell } = require("electron");
const path = require("node:path");

const APP_HTML = path.join(__dirname, "..", "index.html");
const RESERVATION_ORIGIN = "https://center-agk-sp-science.hacomono.jp";
const SMOKE_TEST = process.argv.includes("--smoke-test");

let mainWindow;

function isReservationUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return url.origin === RESERVATION_ORIGIN;
  } catch {
    return false;
  }
}

function openReservationUrl(rawUrl) {
  if (isReservationUrl(rawUrl)) {
    void shell.openExternal(rawUrl);
  }
}

function loadPage(hash = "") {
  return mainWindow.loadFile(APP_HTML, hash ? { hash } : undefined);
}

function createMenu() {
  const template = [
    {
      label: "ページ",
      submenu: [
        {
          label: "夏期講習LP",
          accelerator: "CmdOrCtrl+L",
          click: () => void loadPage(),
        },
        {
          label: "管理ページ",
          accelerator: "CmdOrCtrl+Shift+A",
          click: () => void loadPage("admin"),
        },
        { type: "separator" },
        { role: "quit", label: "終了" },
      ],
    },
    {
      label: "表示",
      submenu: [
        { role: "reload", label: "再読み込み" },
        { role: "resetZoom", label: "表示倍率をリセット" },
        { role: "zoomIn", label: "拡大" },
        { role: "zoomOut", label: "縮小" },
        { type: "separator" },
        { role: "togglefullscreen", label: "全画面表示" },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 960,
    minHeight: 640,
    show: !SMOKE_TEST,
    backgroundColor: "#050807",
    title: "2026年 夏期講習",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    openReservationUrl(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url.startsWith("file:")) return;
    event.preventDefault();
    openReservationUrl(url);
  });

  if (SMOKE_TEST) {
    mainWindow.webContents.once("did-finish-load", async () => {
      try {
        const publicPageRendered = await mainWindow.webContents.executeJavaScript(
          "Boolean(document.querySelector('.site-shell') && document.body.textContent.includes('エイジェックスポーツ科学総合センター'))",
        );
        await loadPage("admin");
        const adminPageRendered = await mainWindow.webContents.executeJavaScript(
          "Boolean(location.hash === '#admin' && document.querySelector('.admin-login'))",
        );
        app.exit(publicPageRendered && adminPageRendered ? 0 : 2);
      } catch {
        app.exit(3);
      }
    });
    mainWindow.webContents.once("did-fail-load", () => app.exit(4));
  }

  void loadPage();
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.setAppUserModelId("jp.co.agekke.sports-science.summer-camp-2026");

  app.whenReady().then(() => {
    createMenu();
    createWindow();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("second-instance", () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}
