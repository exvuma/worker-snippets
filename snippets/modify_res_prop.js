async function handleRequest(request) {
  /**
   * Best practice is to only assign properties on the response
   * object (i.e. ResponseInit props) through either a method or the constructor
   * since properties are immutable
   */
  let originalResponse = await fetch(request)
  let originalBody = await originalResponse.json()
  // Change status and statusText
  // Make sure to pass in originalResponse to preserving all parts
  // of the original response except the part we want to update.
  let response = new Response(originalResponse, { status: 500, statusText: 'some message' })
  // Change response body by adding the foo prop
  let body = JSON.stringify({ foo: 'bar', ...originalBody })
  response = new Response(body, response)
  // Add a header using set method
  response.headers.set('foo', 'bar')
  // Set destination header to the value of the source header
  if (response.headers.has(headerNameSrc)) {
    response.headers.set(headerNameDst, response.headers.get(headerNameSrc))
    console.log(
      `Response header "${headerNameDst}" was set to "${response.headers.get(headerNameDst)}"`,
    )
  }
  return response
}
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * @param {string} headerNameSrc the header to get the new value from
 * @param {string} headerNameDst the header to set based off of value in src
 */
const headerNameSrc = 'foo' //'Orig-Header'
const headerNameDst = 'Last-Modified'
