/* eslint-disable no-undef */
console.log('Background script is running');

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     console.log('Received message in background:', request);
//     // Relay the message to the popup or any other part of the extension
//     console.log("sending data to pages");
//     chrome.runtime.sendMessage(request);
//     chrome.storage.local.set({lastMessage: request});
//   });

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
  
  