// Listens to outbound requests on browser
// before a TCP connection has been established
browser.webRequest.onBeforeRequest.addListener(

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
            "https://www.amazon.com/*" ],
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
}


let smileUrlConstructor = (url) => {
  // Constructs an AmazonSmile URL given an existing Amazon URL
  // Redirects request to AmazonSmile
  let amazonSmile = 'https://smile.amazon.com';
  let regexAmazon = new RegExp(/(amazon\.com)/);
  let regexQueryString = new RegExp(/(\?)/);
  let parseAmazonUrl = url.split(regexAmazon);
  let amazonProduct = parseAmazonUrl[parseAmazonUrl.length-1];
  let smileMoreNoRedirect = 'smdm-noredirect=true';

  let decodedUrl = uriDecoder(amazonSmile + amazonProduct);
  decodedUrl = removesExistingRedirectRule(decodedUrl);

  if(decodedUrl.match(regexQueryString)){
    return { redirectUrl: decodedUrl + '&' + smileMoreNoRedirect };
  } else {
    return { redirectUrl: decodedUrl + '?' + smileMoreNoRedirect };
  }
}


let uriDecoder = (smileUrl) => {
  // Decodes URL strings if referred from non-Amazon site
  if(smileUrl.indexOf('%') != -1) {
    return decodeURIComponent(smileUrl);
  }
  return smileUrl;
}
