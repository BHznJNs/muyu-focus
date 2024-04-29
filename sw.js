const cacheName = "MuYuFocus"

function isResourceToCache(url) {
    const resourcePattern = /\/assets\//
    return resourcePattern.test(url)
}

// intercepting fetch operations
self.addEventListener("fetch", e => {
    async function returnCachedResource(req) {
        const cache = await caches.open(cacheName)
        const cachedResponse = await cache.match(req.url)

        if (cachedResponse) {
            // return cached resources directly
            return cachedResponse
        }

        let fetchResponse
        try {
            fetchResponse = await fetch(req)
        } catch(err) {
            return new Response("Network error happened: " + err, {
                status: 408,
                headers: { "Content-Type": "text/plain" },
            })
        }
        if (isResourceToCache(req.url, "option")) {
            // cache optional resources
            cache.put(req.url, fetchResponse.clone())
        }
        return fetchResponse
    }
    const req = e.request
    e.respondWith(returnCachedResource(req))
})
