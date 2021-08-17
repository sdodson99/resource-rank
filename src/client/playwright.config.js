module.exports = {
  testDir: './e2e',
  webServer: {
    command: 'next start -p 8000',
    port: 8000,
  },
  globalSetup: require.resolve('./e2e/setup/global-setup'),
};
