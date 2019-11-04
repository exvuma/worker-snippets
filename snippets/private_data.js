addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Prevent personal data loss
 * Here, we are defining personal data with regular expressions
 * Execution will be limited to MIME type "text/*"
 */
async function handleRequest(request) {
  let response = await fetch(request)
  let respClone = await response.clone()
  let contentType = response.headers.get('content-type')
  if (!contentType.toLowerCase().includes('text/')) {
    return response
  }
  const text = await response.text()
  const sensitiveData = {
    email: String.raw`\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b`,
    phone: String.raw`\b07\d{9}\b`,
    creditCard: String.raw`\b(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})\b`,
  }
  for (const kind in sensitiveData) {
    let sensitiveRegex = sensitiveData[kind]
    let re = new RegExp(sensitiveRegex, 'ig')
    let match = await re.test(text)
    if (match) {
      return new Response(kind + ' found\nForbidden\n', {
        status: 403,
        statusText: 'Forbidden',
      })
    }
    if (match) {
      text = text.replace(re, '**********')
    }
    //  * Breach events will be posted to a webhook server
    if (match) {
      await postDataBreach(trueClientIp, epoch, request)
      return new Response(kind + ' found\nForbidden\n', {
        status: 403,
        statusText: 'Forbidden',
      })
    }
  }
  return respClone
}

async function postDataBreach(trueClientIp, epoch, request) {
  const someHost = 'https://webhook.flow-wolf.io'
  const url = someHost + '/hooks'
  const body = {
    ip: trueClientIp,
    time: epoch,
    request: request,
  }
  const init = {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  }
  const response = await fetch(url, init)
  return response
}
