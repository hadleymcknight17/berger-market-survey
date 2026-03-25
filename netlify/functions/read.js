const https = require('https');

exports.handler = async function(event) {
  const targetUrl = 'https://default1db98bc4adb94ed397fc842ca77aa7.b7.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/4cf0216798914fb1ac71dbc84b5b8858/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=mcQXknOD1gYu1bkvIlWD3pudNUcJxcUkpFlC6o2AJVo';
  
  return new Promise((resolve) => {
    const parsed = new URL(targetUrl);
    const options = {
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: body
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({ statusCode: 500, body: JSON.stringify({ error: err.message }) });
    });
    
    req.write(event.body || '{}');
    req.end();
  });
};
