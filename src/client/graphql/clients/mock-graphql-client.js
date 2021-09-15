import mocks from './mocks';

export default class MockGraphQLClient {
  constructor(mock) {
    this.mock = mock;
  }

  /**
   * Make a mocked GraphQL request.
   * @param {string} document The GraphQL request document.
   * @param {object} variables The variables for the request.
   * @return {Promise<object>} The request data.
   */
  async fetch(document, variables) {
    const mockData = mocks[this.mock] ?? mocks['standard'];
    const mockDocumentQuery = mockData[document];

    if (!mockDocumentQuery) {
      return {};
    }

    return mockDocumentQuery(variables);
  }
}
