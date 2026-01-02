const http = require('http');

const PORT = process.env.PORT || 3000;
const NODE_ID = "edge-compute-node-131";

/**
 * Simple edge node server that accepts JSON data
 * and performs a basic transformation.
 */
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/compute') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const response = {
          node: NODE_ID,
          status: "processed",
          input: payload,
          result: (payload.value || 0) * 1.15,
          timestamp: new Date().toISOString()
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Invalid JSON input" }));
      }
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ node: NODE_ID, active: true }));
  }
});

server.listen(PORT, () => {
  console.log(`[${NODE_ID}] Running at http://localhost:${PORT}`);
});