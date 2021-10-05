const DataLoader = require('dataloader');
const {
  GetManyResourcesByIdsQuery,
} = require('../queries/get-many-resources-by-ids-query');

const createResourceByIdDataLoader = () => {
  const getManyResourcesByIdsQuery = new GetManyResourcesByIdsQuery();

  const dataLoader = new DataLoader((ids) =>
    getManyResourcesByIdsQuery.execute(ids)
  );

  return dataLoader;
};

exports.createResourceByIdDataLoader = createResourceByIdDataLoader;
