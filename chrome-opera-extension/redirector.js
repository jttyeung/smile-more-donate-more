// Listens to outbound requests on browser
// before a TCP connection has been established
chrome.webRequest.onBeforeRequest.addListener(

  (details) => {
    let url = details.url;

    // Amazon URLs to ignore when redirecting
    let filters = [
                    '(smdm-noredirect=true)',
                    '(openid)',
                    ];

    // Fixes too many redirects bug when
    // user is not logged to Amazon
    if(url.match(filters.join('|'))) {
      return;
    }

    // Returns AmazonSmile URL
    return smileUrlConstructor(url);
  },
  {
    // Checks main and sub-frames (e.g. iframe) under Amazon domains
    urls: [ "http://amazon.com/*",
            "https://amazon.com/*",
            "http://www.amazon.com/*",
            "https://www.amazon.com/*",
            "http://amazon.de/*",
            "https://amazon.de/*",
            "http://www.amazon.de/*",
            "https://www.amazon.de/*",
          ],
    types: ["main_frame","sub_frame"]
  },
  // Blocks initial network request, waits for listener to return
  ['blocking']

);


let removesExistingRedirectRule = (url) => {
  // If user is redirected, e.g. to the Amazon login page, the
  // smdm-noredirect rule is removed from the existing URL before
  // reconstructing AmazonSmile URL. Prevents subsequent pages from
  // being exempt from Smile More, Donate More URL redirects.
  let existingRedirect = new RegExp(/(?:smdm-noredirect%3Dtrue|smdm-noredirect%253Dtrue)+/);

  return url.split(existingRedirect).join();
};


let uriDecoder = (smileUrl) => {
  // Decodes URL strings if referred from non-Amazon site
  if(smileUrl.indexOf('%') != -1) {
    return decodeURIComponent(smileUrl);
  }
  return smileUrl;
};


let checkTld = (url) => {
  let regexAmazon = new RegExp(/(amazon\.com)/);
  let regexAmazonDe = new RegExp(/(amazon\.de)/);
  let amazonSmile = 'https://smile.amazon.com';
  let amazonSmileDe = 'https://smile.amazon.de';
  let splitUrl;

  if(url.match(regexAmazonDe)) {
    splitUrl = url.split(regexAmazonDe);
  } else {
    splitUrl = url.split(regexAmazon);
  }

  let amazonProduct = splitUrl[splitUrl.length-1];

  if(url.match(regexAmazonDe)) {
    return uriDecoder(amazonSmileDe + amazonProduct);
  } else {
    return uriDecoder(amazonSmile + amazonProduct);
  }

}


let smileUrlConstructor = (url) => {
  // Constructs an AmazonSmile URL given an existing Amazon URL
  // Redirects request to AmazonSmile
  let regexQueryString = new RegExp(/(\?)/);
  let smileMoreNoRedirect = 'smdm-noredirect=true';
  let decodedUrl = checkTld(url);
  decodedUrl = removesExistingRedirectRule(decodedUrl);

  if(decodedUrl.match(regexQueryString)){
    return { redirectUrl: decodedUrl + '&' + smileMoreNoRedirect };
  } else {
    return { redirectUrl: decodedUrl + '?' + smileMoreNoRedirect };
  }
};
