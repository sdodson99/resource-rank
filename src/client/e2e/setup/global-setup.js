const http = require('http');
const fs = require('fs');
const path = require('path');

module.exports = async () => {
  console.log('Starting mock GraphQL server.');

  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;

    const mockData = fs.readFileSync(path.join(__dirname, '../mocks/mock.json'));
    res.write(mockData);

    res.end();
  });

  await new Promise((done) => server.listen(8002, done));

  console.log('Successfully started mock GraphQL server.');

  return async () => {
    await new Promise((done) => server.close(done));
  };
};
