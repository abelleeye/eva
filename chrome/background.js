chrome.action.onClicked.addListener(function(tab){
  chrome.tabs.create({ url: '/index.html' });
});
  