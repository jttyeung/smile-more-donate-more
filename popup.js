chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    var url = details.url;
    console.log(details);
    console.log(url);
    return smileUrlConstructor(url);
  },
  {
    urls: ['<all_urls>'],
    types: ["main_frame","sub_frame"]
  },
  ['blocking']
);

function smileUrlConstructor(url){
  var amazonSmile = 'https://smile.amazon.com';
  var regexAmazon = new RegExp(/(www\.amazon\.com)/);
  var parseAmazonUrl = url.split(regexAmazon);
  var amazonProduct = parseAmazonUrl[parseAmazonUrl.length-1];

  if(url.includes('www.amazon.com')) {

    if(amazonProduct !== regexAmazon) {
      return {
        redirectUrl: amazonSmile + amazonProduct
      };
    } else {
      return {
        redirectUrl: amazonSmile
      }
    }

  }

}



// // function getCurrentTabUrl(callback) {
//   // Query filter to be passed to chrome.tabs.query - see
//   // https://developer.chrome.com/extensions/tabs#method-query
//   var queryInfo = {
//     active: true,
//     currentWindow: true
//   };

//   chrome.tabs.query({'active': true}, function(tabs) {

//     // Current tab's URL
//     var tab = tabs[0];
//     var url = tab.url;

//     var regexAmazon = new RegExp(/(www\.amazon\.com)/);

//     if(url.match(regexAmazon)) {

//       // Get product URL string that follows www.amazon.com
//       var parseAmazonUrl = url.split(regexAmazon);
//       var amazonProduct = parseAmazonUrl[parseAmazonUrl.length-1];

//       // If product string exists, redirect current tab URL to smile.amazon.com
//       if(amazonProduct !== regexAmazon) {
//         // chrome.tabs.update(tab.id, {url: 'https://smile.amazon.com' + amazonProduct});
//         // chrome.extension.sendRequest({redirect: 'https://smile.amazon.com' + amazonProduct});
//         return {redirectUrl: redirectUrl};
//       }

//     }

//   });

// });


// chrome.webRequest.onBeforeRequest.addListener(function() {
// chrome.webRequest.onBeforeSendHeaders.addListener(function() {
// chrome.webNavigation.onBeforeNavigate.addListener(function() {
// document.addEventListener('DOMContentLoaded', function() {

// chrome.tabs.onUpdated.addListener(function(){
  // getCurrentTabUrl();
// }
// });


// chrome.webRequest.onBeforeRequest.addListener()
