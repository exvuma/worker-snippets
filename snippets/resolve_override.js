async function handleRequest(request) {
  // Best practice is to always use the original request to construct the new request
  // thereby cloning all the attributes
  const newRequest = new Request(request, { cf: { resolveOverride: origin } })
  // Change how Cloudflare sends outbound request to the origin
  // newRequest.cf.resolveOverride = origin //mysite.com must be proxied on your site
  // Setting cf property requires one *not* to overrwrite the entire cf
  // object, but only set specific properties on cf.
  // These are not testable in the previewer but live a zone only
  // e.g.newRequest.cf = { ...request.cf, apps: false } will silently
  // fail.
  const response = await fetch(newRequest)
  // const body = await gatherResponse(response)
  //Change Cloudflare feature
  // newRequest.cf = { ...request.cf, cacheEverything: true }
  // newRequest.cf = { apps: false }
  console.log('newRequest', newRequest)
  // return new Response(JSON.stringify(newRequest.cf))
  // try {
  // const response = await fetch(newRequest)
  // return new Response(JSON.stringnewRequest.cf)
  // } catch (e) {
  // return new Response(body)
  // }
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
 * gatherResponse awaits and returns a response body as a string.
 * Use await gatherResponse(..) in an async function to get the response body
 */
async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get('content-type')
  if (contentType.includes('application/json')) {
    return JSON.stringify(await response.json())
  } else if (contentType.includes('application/text')) {
    return await response.text()
  } else if (contentType.includes('text/html')) {
    return await response.text()
  } else {
    return await response.text()
  }
}
/**
 * Example someHost is set up to return raw JSON
 * @param {string} url the URL to send the request to
 * @param {string} origin the origin to send the request to
 */
// const someUrl = 'https://demo.workers-tooling.cf' //demos/static/html'
const someUrl = 'https://my-express-project2.victoriabernard922.now.sh/api/date.js'
// const someUrl = 'https://my-express-project.victoriabernard92.now.sh/api/data.js'
// const origin = 'demo.victoriacf.tk' //mysite.com must be proxied on your site
const origin = 'my-express-project.victoriabernard92.now.sh'
// curl  --resolve hostname:port:DESTINATIONIPADDRESS http(s):
// curl -sv /dev/null --resolve demo.victoriacf.tk:443:34.66.134.132 http://demo.victoriacf.tk
// curl -sv /dev/null -H "host:demo.victoriacf.tk" https://my-express-project.victoriabernard92.now.sh/api/date.js
