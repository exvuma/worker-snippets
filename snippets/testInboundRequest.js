addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Fetch and log a given request object
 * @param {Request} request
 */
async function handleRequest(request) {
  console.log('Got request', request)
  let response = { ...request }
  let headers = {}
  for (var header of request.headers.entries()) {
    headers[header[0]] = header[1]
  }
  response.headers = headers
  let fetcher = { ...request.fetcher }
  response.fetcher = fetcher
  return new Response(JSON.stringify(response))
}
