import ResourceExistsError from '@/errors/resource-exists-error';
import ErrorCode from '@/graphql/errors/error-code';
import getErrorCode from '@/graphql/errors/get-error-code';
import useCreateResourceMutation from '../mutations/use-create-resource-mutation';

export default function useResourceCreator() {
  const { execute: executeMutation } = useCreateResourceMutation();

  const createResource = async ({ name, link }) => {
    const { data, error } = await executeMutation({ name, link });

    if (error) {
      const errorCode = getErrorCode(error);

      if (errorCode === ErrorCode.RESOURCE_ALREADY_EXISTS) {
        throw new ResourceExistsError('Resource already exists.', name);
      }

      throw error;
    }

    const createdResource = data?.createResource;

    if (!createdResource) {
      throw new Error('Failed to create resource.');
    }

    return createdResource;
  };

  return {
    createResource,
  };
}
