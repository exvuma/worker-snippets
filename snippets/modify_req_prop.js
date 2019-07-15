async function handleRequest(request) {
  /**
   * Best practice is to only assign new properties on the request
   * object through either a method or the constructor
   */
  let newProps = {
    // Change method
    method: 'POST',
    // Change body
    body: JSON.stringify({ bar: 'foo' }),
    // Change the redirect mode.
    redirect: 'follow',
    //Change headers
    headers: {
      'Content-Type': 'application/json',
    },
    // Change a Cloudflare feature on the outbound response
    cf: { apps: false },
  }
  // Change URL
  // Make sure to pass the new URL into the Request constructor
  let url = someUrl
  // Change just the host
  url = new URL(url)
  url.hostname = someHost
  // Best practice is to always use the original request to construct the new request
  // thereby cloning all the attributes, applying the URL also requires a constructor
  const newRequest = new Request(url, new Request(request, newProps))
  // Set headers using method
  newRequest.headers.set('X-Example', 'bar')
  newRequest.headers.set('Content-Type', 'application/json')
  try {
    return await fetch(newRequest)
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 })
  }
}
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Example someHost is set up to return raw JSON
 * @param {string} someUrl the URL to send the request to, since we are setting hostname too only path is applied
 * @param {string} someHost the host the request will resolve too
 */
const someHost = 'example.com'
const someUrl = 'https://foo.example.com/api/date.js'
