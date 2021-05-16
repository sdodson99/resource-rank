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

  actions.createPage({
    path: `/topics/:topicId/resources/new`,
    matchPath: `/topics/:topicId/resources/new`,
    component: path.resolve('./src/pages/topics/resources/new.js'),
  });

  actions.createPage({
    path: `/topics/:topicId/resources/:resourceId`,
    matchPath: `/topics/:topicId/resources/:resourceId`,
    component: path.resolve('./src/pages/topics/resources/details.js'),
  });

  actions.createPage({
    path: `/`,
    matchPath: `/`,
    component: path.resolve('./src/pages/topics/index.js'),
  });
};

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'build-html' || stage === 'develop-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /node_modules\/@?firebase/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
};
