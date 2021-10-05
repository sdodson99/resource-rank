const DataLoader = require('dataloader');
const {
  GetManyUsersByIdsQuery,
} = require('../queries/get-many-users-by-ids-query');

const createUserByIdDataLoader = (firebaseApp) => {
  const getManyUsersByIdsQuery = new GetManyUsersByIdsQuery(firebaseApp);

  const dataLoader = new DataLoader(
    (ids) => getManyUsersByIdsQuery.execute(ids),
    {
      maxBatchSize: getManyUsersByIdsQuery.maxBatchSize,
    }
  );

  return dataLoader;
};

exports.createUserByIdDataLoader = createUserByIdDataLoader;
