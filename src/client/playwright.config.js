const config = {
  testDir: './e2e',
  retries: 3,
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
  config.use.headless = true;
}

module.exports = config;
