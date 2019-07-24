/**
 * Take in the request but change the URL
 * @param {Request} request
 */
async function handleRequest(request) {
  // construct a new Request object for the new URL,
  // passing the old request as the initialization object.
  const newRequest = new Request(someUrl, request)
  const response = await fetch(newRequest)
  return response
}
/**
 * Example of the WRONG way to modify a URL
 * @param {Request} request
 */
async function handleRequestBad(request) {
  // this will not throw an error, but it won't change the
  // request URL, either
  request.url = someUrl
  const response = await fetch(request)
  return response
}
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Example someHost is set up to return raw JSON
 * @param {string} url the URL to send the request to
 */
const someUrl = 'https://workers-tooling.cf/demos/static/json'
