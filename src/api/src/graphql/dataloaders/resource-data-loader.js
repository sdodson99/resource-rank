const DataLoader = require('dataloader');
const { Resource } = require('../../mongoose/models/resource');

/**
 * Load resources in a batch.
 * @param {Array} resourceIds The resource ids to load.
 * @return {Array} The loaded resources.
 */
async function loadResources(resourceIds) {
  const resources = await Resource.find({ _id: { $in: resourceIds } });

  const resourceMap = {};
  resources.forEach((r) => {
    resourceMap[r._id] = r;
  });

  return resourceIds.map((id) => resourceMap[id]);
}

module.exports = () => new DataLoader((ids) => loadResources(ids));
