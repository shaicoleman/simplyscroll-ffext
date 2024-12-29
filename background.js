browser.runtime.onInstalled.addListener(() => {
  browser.storage.sync.set({ acceleration: 3, interval: 10 });
});
