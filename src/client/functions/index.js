const { https } = require('firebase-functions');
const { default: next } = require('next');

const isDev = process.env.NODE_ENV !== 'production';

const server = next({
  dev: isDev,
  conf: { distDir: '.next' },
});

const handleRequest = server.getRequestHandler();

exports.nextjs = https.onRequest((req, res) => {
  return server.prepare().then(() => handleRequest(req, res));
});
