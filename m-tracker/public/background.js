/* eslint-disable no-undef */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getTitle') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
              chrome.tabs.sendMessage(tabs[0].id, message, sendResponse);
          }
      });
      return true;
  }
});
  
  