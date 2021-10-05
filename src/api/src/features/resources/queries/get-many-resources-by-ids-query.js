const { ResourceModel } = require('../mongoose/resource-model');
const { Resource } = require('../resource');

/**
 * Query for many resources for many IDs.
 */
class GetManyResourcesByIdsQuery {
  /**
   * Initialize with a Mongoose resource model.
   */
  constructor() {
    this.resourceModel = ResourceModel;
  }

  /**
   * Execute the resources query.
   * @param {Array<string>} resourceIds The many resource IDs.
   * @return {Array<Resource>} The many resources in parallel to resource IDs parameter.
   */
  async execute(resourceIds) {
    const resourcesDtos = await this.resourceModel.find({
      _id: { $in: resourceIds },
      // Exclude resources without slugs for backwards compatibility.
      slug: { $ne: null },
    });

    const resources = resourcesDtos.map(
      (r) =>
        new Resource(r.id, {
          name: r.name,
          slug: r.slug,
          link: r.link,
          dateCreated: r.dateCreated,
          createdBy: r.createdBy,
          verified: r.verified,
        })
    );

    const resourceMap = {};
    resources.forEach((r) => {
      resourceMap[r.id] = r;
    });

    return resourceIds.map((id) => resourceMap[id]);
  }
}

exports.GetManyResourcesByIdsQuery = GetManyResourcesByIdsQuery;
