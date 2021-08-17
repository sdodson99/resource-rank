const { test } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

function readMock() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../mock.json')));
}

function writeMock(mock) {
  fs.writeFileSync(path.join(__dirname, '../mock.json'), JSON.stringify(mock));
}

function writeMockResolver(resolver, data) {
  const currentMock = readMock();

  currentMock.data[resolver] = data;

  writeMock(currentMock);
}

function resetMock() {
  writeMock({ data: {} });
}

module.exports = test.extend({
  mockApi: ({}, use) => {
    resetMock();

    use({
      mockResolver: writeMockResolver,
      mockAll: writeMock,
      reset: resetMock,
    });
  },
});
