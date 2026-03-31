const https = require('https');

exports.handler = async function(event) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  const targetUrl = 'https://default1db98bc4adb94ed397fc842ca77aa7.b7.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/4cf0216798914fb1ac71dbc84b5b8858/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=mcQXknOD1gYu1bkvIlWD3pudNUcJxcUkpFlC6o2AJVo';

  // Handle body - Netlify may base64-encode it
  let body = event.body || '{}';
  if (event.isBase64Encoded && body) {
    body = Buffer.from(body, 'base64').toString('utf-8');
  }

  return new Promise((resolve) => {
    const parsed = new URL(targetUrl);
    const options = {
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: data
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: err.message })
      });
    });

    req.write(body);
    req.end();
  });
};
