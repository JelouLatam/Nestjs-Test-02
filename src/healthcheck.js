const http = require('http');

const options = {
    host: 'localhost',
    port: process.env.PORT || 3000,
    path: '/health',
    timeout: 5000
};

const request = http.request(options, (res) => {
    console.log(`Health check STATUS: ${res.statusCode}`);
    process.exit(res.statusCode === 200 ? 0 : 1);
});

request.on('error', (err) => {
    console.error('Health check ERROR', err.message);
    process.exit(1);
});

request.on('timeout', () => {
    console.error('Health check TIMEOUT');
    request.destroy();
    process.exit(1);
});

request.end();