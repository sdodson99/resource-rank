const { DataSource } = require('apollo-datasource');
const DataLoader = require('dataloader');
const { Resource } = require('../../mongoose/models/resource');

/**
 * Data source for resources from a Mongo database.
 */
class MongoResourcesDataSource extends DataSource {
  /**
   * Initialize with Resource model.
   */
  constructor() {
    super();

    this.user = null;
    this.resourceModel = Resource;
    this.resourceDataLoader = new DataLoader(async (resourceIds) => {
      const resources = await this.resourceModel.find({
        _id: { $in: resourceIds },
      });

      const resourceMap = {};
      resources.forEach((r) => {
        resourceMap[r._id] = r;
      });

      return resourceIds.map((id) => resourceMap[id]);
    });
  }

  /**
   * Initialize the data source with the request config.
   * @param {object} config The request config.
   */
  initialize({ context }) {
    const { user } = context;

    this.user = user;
  }

  /**
   * Find a resource by ID.
   * @param {string} id The ID of the resource to find.
   * @return {Promise<object>} The resource matching the ID. Null if resource not found.
   */
  getById(id) {
    console.log(id);
    return this.resourceDataLoader.load(id);
  }

  /**
   * Search for resources.
   * @param {string} query The resource query to search for.
   * @param {number} skip The resources to skip in the search query.
   * @param {number} limit The resource amount to limit to in the search query.
   * @return {Promise<object>} The resources matching the query.
   */
  search(query, skip = 0, limit = 0) {
    let request = this.resourceModel.find({
      name: { $regex: query, $options: 'i' },
    });

    if (skip) {
      request = request.skip(skip);
    }

    if (limit) {
      request = request.limit(limit);
    }

    return request;
  }

  /**
   * Search for resources by multiple IDs and a search string.
   * @param {Array} ids The resource IDs to search for.
   * @param {string} search The resource query to filter by.
   * @return {Array} The resources matching the search.
   */
  getByIds(ids, search) {
    return this.resourceModel.find({
      _id: { $in: ids },
      name: { $regex: search, $options: 'i' },
    });
  }

  /**
   * Check if a resource name already exists.
   * @param {string} name The name to check.
   * @return {Promise<boolean>} True/false for already exists.
   */
  nameExists(name) {
    return this.resourceModel.exists({ name });
  }

  /**
   * Create a new resource.
   * @param {string} name The name of the resource.
   * @param {string} link The link to the resource.
   * @return {Promise<object>} The created resource.
   * @throws {ApolloError} Thrown if resource name alredy exists.
   * @throws {AuthenticationError} Thrown if user is not authenticated.
   */
  async create(name, link) {
    if (!this.user) {
      throw new AuthenticationError();
    }
    const { uid } = this.user;

    if (await this.nameExists(name)) {
      throw new ApolloError(
        'Resource already exists.',
        'RESOURCE_ALREADY_EXISTS'
      );
    }

    return await this.resourceModel.create({ name, link, createdBy: uid });
  }
}

module.exports = MongoResourcesDataSource;
