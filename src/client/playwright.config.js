const config = {
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    headless: false,
  },
};

if (process.env.CI) {
  config.webServer = {
    command: 'next start -p 3000',
    port: 3000,
  };
}

module.exports = config;
