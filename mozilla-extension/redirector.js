// Listens to outbound requests on browser
// before a TCP connection has been established
browser.webRequest.onBeforeRequest.addListener(

  function(details) {
    var url = details.url;

    // Amazon URLs to ignore when redirecting
    var filters = [ '(redirect=true)',
                    '(redirector.html)',
                    '(/ap/)',
                    '(smdm-noredirect=true)',
                    ];

    // Fixes too many redirects bug when
    // user is not logged to Amazon
    if(url.match(filters.join('|'))) {
      return;
    }

    // If user is redirected, e.g. to the Amazon login page, the
    // smdm-noredirect rule is removed from the existing URL before
    // reconstructing AmazonSmile URL. Prevents subsequent pages from
    // being exempt from Smile More, Donate More URL redirects.
    var existingRedirect = new RegExp(/'smdm-noredirect%3Dtrue'/)

    if(url.match(existingRedirect)) {
      url = url.split(existingRedirect).join()
    }

    // Returns AmazonSmile URL
    return smileUrlConstructor(url);
  },
  {
    // Checks main and sub-frames (e.g. iframe) under Amazon domains
    urls: [ "http://amazon.com/*",
            "https://amazon.com/*",
            "http://www.amazon.com/*",
            "https://www.amazon.com/*" ],
    types: ["main_frame","sub_frame"]
  },
  // Blocks initial network request, waits for listener to return
  ['blocking']

);


// Constructs an AmazonSmile URL given an existing Amazon URL
// Redirects request to AmazonSmile
function smileUrlConstructor(url) {
  var amazonSmile = 'https://smile.amazon.com';
  var regexAmazon = new RegExp(/(amazon\.com)/);
  var parseAmazonUrl = url.split(regexAmazon);
  var amazonProduct = parseAmazonUrl[parseAmazonUrl.length-1];

  var regexQueryString = new RegExp(/(\?)/);
  var smileMoreNoRedirect = 'smdm-noredirect=true';

  var decodedUrl = uriDecoder(amazonSmile + amazonProduct);

  if(amazonProduct.match(regexQueryString)){
    return { redirectUrl: decodedUrl + '&' + smileMoreNoRedirect };
  } else {
    return { redirectUrl: decodedUrl + '?' + smileMoreNoRedirect };
  }

}


// Decodes URI if necessary (e.g. encoded as a result of a redirect)
function uriDecoder(url) {
  if(url.indexOf('%') != -1) {
    return decodeURIComponent(url);
  }
}
