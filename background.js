chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ acceleration: 15, interval: 10 });
});
