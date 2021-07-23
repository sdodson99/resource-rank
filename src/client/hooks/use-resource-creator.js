import getErrorCode from '../errors/apollo-error-code-provider';
import ResourceExistsError from '../errors/resource-exists-error';
import createResourceMutation from '../graphql/mutations/create-resource-mutation';

export default function useResourceCreator() {
  const [executeCreateResourceMutation, { loading: isCreatingResource }] =
    useMutation(createResourceMutation);

  const createResource = async (name, link) => {
    try {
      const { data } = await executeCreateResourceMutation({
        variables: { name, link },
      });

      const createdResource = data?.createResource;

      if (!createdResource) {
        throw new Error('Failed to create resource.');
      }

      return createdResource;
    } catch (error) {
      if (error instanceof ApolloError) {
        const errorCode = getErrorCode(error);

        if (errorCode === 'RESOURCE_ALREADY_EXISTS') {
          throw new ResourceExistsError('Resource name already exists.');
        }
      }

      throw error;
    }
  };

  return { createResource, isCreatingResource };
}
