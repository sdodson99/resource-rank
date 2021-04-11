const path = require(`path`);

exports.createPages = ({ actions }) => {
  actions.createPage({
    path: `/topics/details/:topicId`,
    matchPath: `/topics/details/:topicId`,
    component: path.resolve('./src/pages/topics/details.js'),
  });
};
