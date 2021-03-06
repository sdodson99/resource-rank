const { DataSource } = require('apollo-datasource');
const { AuthenticationError, ApolloError } = require('apollo-server');
const slugify = require('../../common/slugify');
const validateResource = require('../validators');
const logger = require('../../../monitoring/logger');
const { ResourceModel } = require('../mongoose/resource-model');
const {
  createResourceByIdDataLoader,
} = require('./resource-by-id-data-loader');

/**
 * Data source for resources from a Mongo database.
 */
class ResourcesDataSource extends DataSource {
  /**
   * Initialize with Resource model.
   */
  constructor() {
    super();

    this.user = null;
    this.resourceModel = ResourceModel;
    this.resourceDataLoader = createResourceByIdDataLoader();
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
   * @throws {Error} Thrown if query fails.
   */
  async getById(id) {
    const resource = await this.resourceDataLoader.load(id);

    if (!resource) {
      return null;
    }

    return resource;
  }

  /**
   * Find a resource by slug.
   * @param {string} slug The slug of the resource to find.
   * @return {Promise<object>} The resource matching the slug. Null if resource not found.
   * @throws {Error} Thrown if query fails.
   */
  async getBySlug(slug) {
    const resource = await this.resourceModel.findOne({
      slug,
    });

    if (!resource) {
      return null;
    }

    return resource;
  }

  /**
   * Search for resources.
   * @param {string} query The resource query to search for.
   * @param {object} options Options for the search.
   * @return {Promise<object>} The resources matching the query.
   * @throws {Error} Thrown if query fails.
   */
  async search(query = '', { offset = 0, limit = 20, excludeIds = [] } = {}) {
    const { docs, total } = await this.resourceModel.paginate(
      {
        _id: { $nin: excludeIds },
        name: { $regex: query, $options: 'i' },
        slug: { $ne: null },
      },
      {
        offset,
        limit,
        sort: { verified: -1 },
      }
    );

    logger.info('Successfully executed resource search with query', query);

    return {
      items: docs,
      totalCount: total,
    };
  }

  /**
   * Search for resources by multiple IDs and a search string.
   * @param {Array} ids The resource IDs to search for.
   * @param {string} search The resource query to filter by.
   * @return {Array} The resources matching the search.
   * @throws {Error} Thrown if query fails.
   */
  getByIds(ids, search = '') {
    return this.resourceModel.find({
      _id: { $in: ids },
      name: { $regex: search, $options: 'i' },
      slug: { $ne: null },
    });
  }

  /**
   * Check if a resource name already exists.
   * @param {string} name The name to check.
   * @return {Promise<boolean>} True/false for already exists.
   * @throws {Error} Thrown if request fails.
   */
  nameExists(name) {
    return this.resourceModel.exists({ name });
  }

  /**
   * Create a new resource.
   * @param {string} name The name of the resource.
   * @param {string} link The link to the resource.
   * @return {Promise<object>} The created resource.
   * @throws {ApolloError} Thrown if resource name already exists.
   * @throws {ApolloError} Thrown if resource validation fails.
   * @throws {AuthenticationError} Thrown if user is not authenticated.
   * @throws {Error} Thrown if create fails.
   */
  async create(name, link) {
    if (!this.user) {
      throw new AuthenticationError();
    }

    const { id: userId } = this.user;
    const slug = slugify(name);
    const resource = {
      name,
      slug,
      link,
      createdBy: userId,
    };

    const { isValid, message } = validateResource(resource);

    if (!isValid) {
      throw new ApolloError(message, 'RESOURCE_VALIDATION_ERROR');
    }

    if (await this.nameExists(resource.name)) {
      throw new ApolloError(
        'Resource already exists.',
        'RESOURCE_ALREADY_EXISTS'
      );
    }

    const slugExists = await this.resourceModel.exists({ slug: resource.slug });

    if (slugExists) {
      throw new ApolloError(
        'Resource slug already exists.',
        'RESOURCE_ALREADY_EXISTS'
      );
    }

    return await this.resourceModel.create(resource);
  }
}

exports.ResourcesDataSource = ResourcesDataSource;
