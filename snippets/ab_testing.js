async function handleRequest(request) {
  const NAME = 'experiment-0'
  // Responses below are place holders, you could set up
  // a custom path for each test (e.g. /control/somepath )
  const TEST_RESPONSE = new Response('Test group') // fetch('/test/sompath', request)
  const CONTROL_RESPONSE = new Response('Control group') // fetch('/control/sompath', request)
  // Determine which group this requester is in.
  const cookie = request.headers.get('cookie')
  if (cookie && cookie.includes(`${NAME}=control`)) {
    return CONTROL_RESPONSE
  } else if (cookie && cookie.includes(`${NAME}=test`)) {
    return TEST_RESPONSE
  } else {
    // if no cookie then this is a new client, decide a group and set the cookie
    let group = Math.random() < 0.5 ? 'test' : 'control' // 50/50 split
    let response = group === 'control' ? CONTROL_RESPONSE : TEST_RESPONSE
    response.headers.append('Set-Cookie', `${NAME}=${group}; path=/`)
    return response
  }
}
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
