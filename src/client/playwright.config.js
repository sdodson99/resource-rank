const config = {
  testDir: './e2e',
  retries: 2,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
};

if (process.env.CI) {
  config.webServer = {
    command: 'next start -p 3000',
    port: 3000,
  };
}

module.exports = config;
