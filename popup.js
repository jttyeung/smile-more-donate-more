function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query({'active': true}, function(tabs) {

    // Current tab's URL
    var tab = tabs[0];
    var url = tab.url;

    var regexAmazon = new RegExp(/(www\.amazon\.com)/);

    if(url.match(regexAmazon)) {

      // Get product URL string that follows www.amazon.com
      var parseAmazonUrl = url.split(regexAmazon);
      var amazonProduct = parseAmazonUrl[parseAmazonUrl.length-1];

      // If product string exists, redirect current tab URL to smile.amazon.com
      if(amazonProduct !== regexAmazon) {
        chrome.tabs.update(tab.id, {url: 'https://smile.amazon.com' + amazonProduct});
      }

    }

  });

}


document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl();
});
