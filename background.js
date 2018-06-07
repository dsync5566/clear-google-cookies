
// An object used for caching data about the browser's cookies, which we update
// as notifications come in.
function CookieCache() {
  this.cookies_ = {};
  this.reset = function() {
    this.cookies_ = {};
  }
  this.add = function(cookie) {
    var domain = cookie.domain;
    if (!this.cookies_[domain]) {
      this.cookies_[domain] = [];
      //console.log('DOMAIN: ' + domain);
    }
    this.cookies_[domain].push(cookie);
  };

  this.getCookies = function(domain) {
    return this.cookies_[domain];
  };
}

var cache = new CookieCache();
var domainList = [ 
  ".youtube.com", 
  "www.youtube.com", 
  ".google.com", 
  "www.google.com", 
  "apis.google.com", 
  ".google.com.tw"
];

function removeCookie(cookie) {
  var url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;

  chrome.cookies.remove({"url": url, "name": cookie.name}, function(r_cookie) {
    console.log("remove cookie url is " + r_cookie.url);
  });
}

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {  
  domainList.push(tab.url.match(/:\/\/(.[^/:]+)/)[1]);

  chrome.cookies.getAll({}, function(cookies) {
    for (var i in cookies) {
      cache.add(cookies[i]);
    }

    for (var d in domainList) {
      var getCookies = cache.getCookies(domainList[d]);

      for (var i in getCookies) {
        console.log("Cookie is : " + JSON.stringify(getCookies[i]));
        removeCookie(getCookies[i]);
      }
    }

    cache.reset();
  });
});
