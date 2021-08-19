const path = require('path');

module.exports = ({ config }) => {
  config.resolve.alias = {
    '@/validators': path.resolve(__dirname, '..', 'validators'),
    '@/hooks': path.resolve(__dirname, '..', 'hooks'),
    '@/components': path.resolve(__dirname, '..', 'components'),
    '@/graphql': path.resolve(__dirname, '..', 'graphql'),
    '@/services': path.resolve(__dirname, '..', 'services'),
    '@/styles': path.resolve(__dirname, '..', 'styles'),
    '@/configuration': path.resolve(__dirname, '..', 'configuration'),
    '@/errors': path.resolve(__dirname, '..', 'errors'),
  };

  return config;
};
