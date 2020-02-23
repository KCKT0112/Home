/* EasySW - uframework for Service Worker

MIT License

Copyright (c) 2020 Jin Wa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

/* eslint-disable */
// Common Config
const cacheNamePrefix = "Home";
const cacheNameSuffix = "v1";
const isDebug = false;
const isNeedPrecaching = true;
const isNeedRouting = true;
const autoClearCacheWhenUpdated = true;
const forceListenOnActivateEvent = false;
const Response_CacheFirst = 0;
const Response_NetworkFirst = 1;
const Response_CacheOnly = 2;
const Response_NetworkOnly = 3;
const Response_Default = Response_CacheFirst;
const enableNavigationPreload = false; // It will turn on routing, and it just works with urls exclude routing rules

console.log(
    `%c EasySW %c Initialization %c`,
    'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
    'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
    'background:transparent'
);


// Extra Config
/* Use A File to Identify Precaching Files */
/*
Just Add webpack-manifest-plugin like:
````
new WebpackManifestPlugin({
        fileName: "precaching-list.js",
        serialize: (manifest) => {
          let precahings = [];
          for (let [key, value] of Object.entries(manifest)){
            precahings.push(value);
          }
          return "__manifestPrecaching = " + JSON.stringify(precahings, null, 2) + ";";
        },
      })
````
And it will save a list to precaching-list.js
*/
const useFileToIdentifyPrecachingFiles = true;
const targetFile = './precaching-list.js';

/* App Shell Mode */
/* To Adapt for Single Page Application */
/* Trun on App Shell Mode will turn on Routing */
const useAppShellMode = true;
const appShellCachingTarget = "/";


// Precache Config
let precachingFiles = [];


// Routing Config
// Howto: Add like above to list
// [String|RegExp, Int | (FetchEvent, Request) -> (Int | (FetchEvent) -> void)]
// for example: ["/", Response_NetworkFirst]
let routingRules = [
    // [new RegExp("/api/"), Response_NetworkOnly],
    // [new RegExp("https://recaptcha.net/"), Response_NetworkOnly]
];


// Real Code:
// DO NOT EDIT ABOVE BEFORE YOU UNDERSTAND ENGOUGH
let print = (message) => {
    if (isDebug)
        self.console.log(`Service Worker: ${message}`);
};


let makeCacheName = () => `${cacheNamePrefix}-${cacheNameSuffix}`;


const HOST = location.host;

const isCachableRequest = (request) => request.method == "GET";

const isCORSRequest = (url) => url.search(HOST);

const correctRequest = (request) => {
    if (isCORSRequest(request.url) && isCachableRequest(request)) {
        return new Request(request.url, { mode: 'cors' });
    } else {
        return request;
    }
};


let translateResponse = (response) => {
    if (response === Response_NetworkFirst) {
        return 'Response_NetworkFirst';
    } else if (response === Response_CacheFirst) {
        return 'Response_CacheFirst';
    } else if (response === Response_CacheOnly) {
        return 'Response_CacheOnly';
    } else if (response === Response_NetworkOnly) {
        return 'Response_NetworkOnly';
    } else {
        return response;
    }
};


const getCache = (() => {
    let cacheName = makeCacheName();
    return (() => {
        return self.caches.open(cacheName);
    });
})();


// (CacheStorge) -> Promise
const withCache = (callback) => {
    return getCache().then(cache => callback(cache));
};


/* Startup */
if (useFileToIdentifyPrecachingFiles) {
    importScripts(targetFile);
    for (let e of (__manifestPrecaching || [])) {
        precachingFiles.push(e);
        routingRules.push([e, Response_CacheFirst]);
    }
    print(`Use ${targetFile} to found which file need to be precaching`);
    print(`${__manifestPrecaching} were set to precache`);
}

if (useAppShellMode) {
    precachingFiles.push(appShellCachingTarget);
}


/* Event Listeners */
self.addEventListener('install', (e) => {
    print("Installed");
    let cacheName = makeCacheName();
    if (isNeedPrecaching) {
        e.waitUntil(
            self.caches.open(cacheName).then((cache) => {
                print("Caching prechache files");
                return cache.addAll(precachingFiles);
            })
        );
    }
});


let Target_CacheFirst = (e, request) => {
    return caches.match(request).then((r) => {
        return r || fetch(e.request).then((response) => {
            if (isCachableRequest(e.request)) {
                return withCache(
                    cache => cache.put(e.request, response.clone())
                ).then(() => response);
            } else {
                return response;

            }
        });
    });
};


let Target_NetworkFirst = (e, request) => {
    return fetch(request)
        .then((response) => {
            if (response.ok && isCachableRequest(request)) {
                return withCache(
                    cache => cache.put(e.request, response.clone())
                ).then(() => response);
            } else {
                return response;
            }
        })
        .catch(() => {
            return caches.match(e.request).then((cachedResponse) => cachedResponse);

        });
};


let Target_CacheOnly = (e, request) => {
    return self.caches.match(request);
};


let Target_NetworkOnly = (_, request) => fetch(request);


let respondFetchWith = (event, response) => {
    if (response === Response_CacheFirst) {
        event.respondWith(Target_CacheFirst(event, correctRequest(event.request)));
    } else if (response === Response_NetworkFirst) {
        event.respondWith(Target_NetworkFirst(event, correctRequest(event.request)));
    } else if (response === Response_NetworkOnly) {
        event.respondWith(Target_NetworkOnly(event, correctRequest(event.request)));
    } else if (response === Response_CacheOnly) {
        event.respondWith(Target_CacheOnly(event, correctRequest(event.request)));
    } else if ((typeof response) === "function") {
        let result = response(event);
        if ((typeof response) === "function") {
            result(event, correctRequest(event.request));
        } else if ((typeof result) === "number") {
            respondFetchWith(event, result);
        } else {
            print(`Could not handle routing with ${response} -> ${result}`);
        }
    } else {
        respondFetchWith(event, Response_Default);
        print(`Non-handled ${event.request.url}`);
    }
};


if (isNeedRouting || useAppShellMode || enableNavigationPreload) {
    self.addEventListener('fetch', (e) => {
        if (!e.request.url.startsWith("http")) {
            return;
        }
        if (useAppShellMode) {
            if (e.request.mode === 'navigate') {
                e.respondWith(caches.match(appShellCachingTarget));
                return;
            }
        }
        if (isNeedRouting) {
            for (let [rule, action] of routingRules) {
                if (typeof rule === "string") {
                    if (e.request.url.includes(rule)) {
                        respondFetchWith(e, action);
                        print(`Routing: Hit via string match, ${e.request.url} % ${rule} -> ${translateResponse(action)}`);
                        return;
                    }
                } else if ((typeof rule.test === "function")) {
                    if (rule.test(e.request.url)) {
                        respondFetchWith(e, action);
                        print(`Routing: Hit via regexp match, ${e.request.url} % ${rule} -> ${translateResponse(action)}`);
                        return;
                    }
                }
            }
        }
        if (enableNavigationPreload) {
            e.waitUntil(e.preloadResponse.then((response) => {
                if (response) {
                    e.respondWith(response);
                } else {
                    respondFetchWith(e, Response_Default);
                }
            }));
        } else {
            return;
        }
    });
    print("Routing Enabled");
}


if (forceListenOnActivateEvent || autoClearCacheWhenUpdated || enableNavigationPreload) {
    self.addEventListener('activate', (e) => {
        let cacheName = makeCacheName();
        let promises = [];
        if (autoClearCacheWhenUpdated) {
            promises.push(
                caches.keys().then((keyList) => {
                    return Promise.all(keyList.map((key) => {
                        if (key != cacheName) {
                            print(`Deleting ${key}`);
                            return caches.delete(key);
                        }
                    }));
                })
            );
        }
        if (enableNavigationPreload && self.registration.navigationPreload) {
            promises.push(
                self.registration.navigationPreload.enable().then(() => {
                    print("Navigation Preload Enabled");
                })
            );
        }
        if (promises.length > 0) {
            e.waitUntil(Promise.all(promises));
        }
    });
}