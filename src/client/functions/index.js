const { https, config } = require('firebase-functions');
const { default: next } = require('next');

const configuration = config();

const isDev = configuration.env.value !== 'production';

const server = next({
  dev: isDev,
  conf: {
    distDir: '.next',
  },
});

const handleRequest = server.getRequestHandler();

exports.nextjs = https.onRequest((req, res) => {
  return server.prepare().then(() => handleRequest(req, res));
});
