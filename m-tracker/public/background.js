/* eslint-disable no-undef */


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getTitle') {
    console.log("message processing");
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
              chrome.tabs.sendMessage(tabs[0].id, message, sendResponse);
          }
      });
      return true;
  }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ isFirstOpen: true });
  });
  
