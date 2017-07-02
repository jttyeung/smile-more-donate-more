// Listens to outbound requests on Chrome
// before a TCP connection has been established
chrome.webRequest.onBeforeRequest.addListener(

  function(details) {
    var url = details.url;

    // Filters for www.amazon.com requests only
    if(url.includes('www.amazon.com')) {
      return smileUrlConstructor(url);
    }
  },
  {
    // Listens while on all URLs
    urls: ['<all_urls>'],
    types: ["main_frame","sub_frame"]
  },
  ['blocking']

);


// Constructs an AmazonSmile URL given an existing Amazon URL
// Redirects request to AmazonSmile
function smileUrlConstructor(url){

  var amazonSmile = 'https://smile.amazon.com';
  var regexAmazon = new RegExp(/(www\.amazon\.com)/);
  var parseAmazonUrl = url.split(regexAmazon);
  var amazonProduct = parseAmazonUrl[parseAmazonUrl.length-1];

  if(amazonProduct !== regexAmazon) {
    return {
      redirectUrl: amazonSmile + amazonProduct
    };
  }

}
