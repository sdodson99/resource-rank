const path = require('path');

module.exports = ({ config }) => {
  config.resolve.alias = {
    '@/validators': path.resolve(__dirname, '..', 'validators'),
  };

  return config;
};
