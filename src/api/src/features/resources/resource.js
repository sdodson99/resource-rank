/**
 * Resource model.
 */
class Resource {
  /**
   * Initialize with resource details.
   * @param {string} id The resource ID.
   * @param {object} details The resource details.
   */
  constructor(id, { name, slug, link, dateCreated, createdBy, verified }) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.link = link;
    this.dateCreated = dateCreated;
    this.createdBy = createdBy;
    this.verified = verified;
  }
}

exports.Resource = Resource;
