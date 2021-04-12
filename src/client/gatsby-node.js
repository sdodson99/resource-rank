const path = require(`path`);

exports.createPages = ({ actions }) => {
  actions.createPage({
    path: `/topics/:topicId`,
    matchPath: `/topics/:topicId`,
    component: path.resolve('./src/pages/topics/details.js'),
  });
};
