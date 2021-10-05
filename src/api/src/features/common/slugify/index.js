const slug = require('slugify');

slug.extend({ '#': 'sharp' });

const slugify = (value) => {
  return slug(value, {
    lower: true,
  });
};

module.exports = slugify;
