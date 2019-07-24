async function handleRequest(request) {
  const url = new URL(request.url)
  const apiurl = url.searchParams.get('apiurl')
  //rewrite request to point to API url
  request = new Request(apiurl, request)
  request.headers.set('Origin', new URL(apiurl).origin)
  let response = await fetch(request)
  response = new Response(response.body, response)
  //rewrite cors header
  response.headers.set('Access-Control-Allow-Origin', url.origin)
  //add Vary header so browser will cache response correctly
  let vary = response.headers.append('Vary', 'Origin')
  return response
}
addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  if (url.pathname.startsWith(proxyEndpoint)) {
    event.respondWith(handleRequest(event.request))
  } else {
    event.respondWith(rawHtmlResponse(demoPage))
  }
})
const apiurl = 'http://workers-tooling.cf/demos/demoapi'
const proxyEndpoint = '/corsproxy/'
async function rawHtmlResponse(html) {
  const init = {
    headers: {
      'content-type': 'text/html;chaasdrset=UTF-8',
    },
  }
  return new Response(html, init)
}
const demoPage = `
<!DOCTYPE html>
<html>
<body>
  <h1>API Fetch without CORS Proxy</h1>
  <code id='noproxy'>Waiting</code>
  <h1>API Fetch with CORS Proxy</h1>
  <code id='proxy'>Waiting</code>
  <script>
  noproxy = async () => {
    let response = await fetch('${apiurl}')
    return await response.json()
  }
  proxy = async () => {
    let response = await fetch(window.location.origin + '${proxyEndpoint}?apiurl=${apiurl}')
    return await response.json()
  }
  (async () => {
    console.log("dasdae", e)
    try {
      let data = await noproxy()
      document.getElementById('noproxy').innerHTML = data
    } catch (e) {
      console.log("e", e)
      document.getElementById('noproxy').innerHTML = e
    }
    try {
      let data = await proxy()
      document.getElementById('proxy').innerHTML = JSON.stringify(data)
    } catch (e) {
      console.log("e", e)
      document.getElementById('proxy').innerHTML = e
    }
  })()
  </script>
</body>
</html>`
