async function handleRequest(request) {
  // For illustrative purposes, we define responses for each of the conditions
  var responses = {
    ASN: new Response('ASN response'),
    POST: new Response('POST response'),
    BOT: new Response('BOT User Agent response', { status: 403 }),
    IP: new Response('IP response'),
    mobile: new Response.redirect('mobile.example.com'),
    blockedHost: new Response('Blocked host response', { status: 403 }),
    blockedExtension: new Response('Blocked extension', { status: 403 }),
  }
  // On URL's hostname
  let url = new URL(request.url)
  if (blockedHostnames.includes(url.hostname)) {
    return responses.blockedHost
  }
  // On URL's file extenstion (e.g. block paths ending in .doc or .xml)
  let forbiddenExtRegExp = new RegExp(/\.(doc|xml)$/)
  if (forbiddenExtRegExp.test(url.pathname)) {
    return responses.blockedExtension
  }
  // On HTTP method
  if (request.method === 'POST') {
    return responses.POST
  }
  // On User Agent
  let userAgent = request.headers.get('User-Agent') || ''
  if (userAgent.includes('bot')) {
    return responses.BOT
  }
  // On Client's IP address
  let clientIP = request.headers.get('CF-Connecting-IP')
  if (clientIP === '2606:4700:ff02:8250:5c23:f51b:a5ff:67b1') {
    return responses.IP
  }
  // On ASN
  if ((request.cf || {}).asn == 64512) {
    return responses.ASN
  }
  // On Device Type
  //  Requires Enterprise "CF-Device-Type Header" zone setting or
  //  Page Rule with "Cache By Device Type" setting applied.
  let device = request.headers.get('CF-Device-Type')
  if (device === 'mobile') {
    return responses.mobile
  }
  console.error(
    "Getting Client's IP address, device type, and ASN are not supported in playground. Must test on a live worker",
  )
  return fetch(request)
}
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
const blockedHostnames = [
  'nope.mywebsite.com',
  'nachosite.mywebsite.com',
  'bye.website.com',
]
// Return a response based on the incoming request's URL, HTTP method, User Agent, IP address, or ASN
