const path = require(`path`);

exports.createPages = ({ actions }) => {
  actions.createPage({
    path: `/topics/:topicId`,
    matchPath: `/topics/:topicId`,
    component: path.resolve('./src/pages/topics/details.js'),
  });

  actions.createPage({
    path: `/topics/:topicId/resources/add`,
    matchPath: `/topics/:topicId/resources/add`,
    component: path.resolve('./src/pages/topics/resources/add.js'),
  });
};
