module.exports = {
  testDir: './e2e',
  webServer: {
    command: 'NEXT_PUBLIC_GQL_URL=http://localhost:8002 next dev -p 8000',
    port: 8000,
  },
  globalSetup: require.resolve('./e2e/setup/global-setup'),
};
