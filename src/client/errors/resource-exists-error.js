export default class ResourceExistsError extends Error {
  constructor(message, resourceName) {
    super(message);

    this.name = 'ResourceExistsError';
    this.resourceName = resourceName;
  }
}
