const Othereurl = 'https://slides.victoriabernard.com/serverlessdays-2019/images/OriginCors.png'
addEventListener('fetch', event => {
  const url = event.request.url
  if (url.includes('babyme')) return event.respondWith(cacheZone(event))
  if (url.includes('notZone.png')) return event.respondWith(cacheZone(event.request, Othereurl))
  return event.respondWith(new Response('not match path'))
})
const storURL = 'https://slides.missv.info/workers-slides-0517/images/babymes.png'
async function cacheZone(req, url = '') {
  let key = url || storURL
  url = url || req.url
  try {
    let cache = caches.default
    let cacheResp = await cache.match(url)
    if (!cacheResp) {
      fetchRes = await fetch(url)
      await cache.put(key, fetchRes)
      // response = new Response(response.body, response)
      respToRet = new Response('Added to cache ' + key, {
        headers: { 'content-type': 'text/html' },
      })
    } else {
      respToRet = 'Got a hit for ' + url
      cache.delete(url)
    }
  } catch (e) {
    respToRet = 'Error thrown ' + e.message
  }
  return respToRet
}
