/**
 * Example someHost at url is set up to respond with HTML
 * Replace url with the host you wish to send requests to
 *  */
const someHost = 'https://workers-tooling.cf/demos'
const url = someHost + '/static/html'

/**
 * gatherResponse awaits and returns a response body as a string.
 * Use await gatherResponse(..) in an async function to get the response body
 * @param {Response} response
 */
async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get('content-type')

  if (contentType.includes('application/json')) {
    return await response.json()
  } else if (
    contentType.includes('application/text')
  ) {
    return await response.text()
  } else if (contentType.includes('text/html')) {
    return await response.text()
  } else {
    return await response.text()
  }
}

/**
 * handleRequest sends a GET request expecting html
 * and then returns a response with that HTML
 * @param {Request} request the incoming request
 */
async function handleRequest(request) {
  const init = {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  }

  const response = await fetch(url, init)
  const results = await gatherResponse(response)

  return new Response(results, init)
}

addEventListener('fetch', event => {
  return event.respondWith(
    handleRequest(event.request)
  )
})
