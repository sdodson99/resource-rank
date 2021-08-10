import useCreateResourceMutation from '../../mutations/use-create-resource-mutation';
import getErrorCode from '@/graphql/errors/get-error-code';
import ErrorCode from '@/graphql/errors/error-code';
import ResourceExistsError from '@/errors/resource-exists-error';
import { when } from 'jest-when';
import useResourceCreator from '../use-resource-creator';

jest.mock('../../mutations/use-create-resource-mutation');
jest.mock('@/graphql/errors/get-error-code');

describe('useResourceCreator', () => {
  afterEach(() => {
    useCreateResourceMutation.mockReset();
    getErrorCode.mockReset();
  });

  describe('createResource', () => {
    let mockExecuteMutation;

    let name;
    let link;
    let error;

    beforeEach(() => {
      mockExecuteMutation = jest.fn();
      useCreateResourceMutation.mockReturnValue({
        execute: mockExecuteMutation,
      });

      name = 'resource-name';
      link = 'resource-link';
      error = new Error();
    });

    it('should throw resource already exists error if resource already exists', async () => {
      when(mockExecuteMutation)
        .calledWith({ name, link })
        .mockReturnValue({ error });
      when(getErrorCode)
        .calledWith(error)
        .mockReturnValue(ErrorCode.RESOURCE_ALREADY_EXISTS);

      const { createResource } = useResourceCreator();

      await expect(
        async () => await createResource({ name, link })
      ).rejects.toThrow(ResourceExistsError);
    });

    it('should throw error if request returns error', async () => {
      when(mockExecuteMutation).calledWith({ name, link }).mockReturnValue({ error });

      const { createResource } = useResourceCreator();

      await expect(
        async () => await createResource({ name, link })
      ).rejects.toThrow();
    });

    it('should throw error if request returns no created resource', async () => {
      when(mockExecuteMutation)
        .calledWith({ name, link })
        .mockReturnValue({ data: null });

      const { createResource } = useResourceCreator();

      await expect(
        async () => await createResource({ name, link })
      ).rejects.toThrow();
    });

    it('should return created resource if successful', async () => {
      const expected = {
        id: '123',
        name,
        link,
        slug: 'resource-name',
      };
      when(mockExecuteMutation)
        .calledWith({ name, link })
        .mockReturnValue({ data: { createResource: expected } });

      const { createResource } = useResourceCreator();
      const actual = await createResource({ name, link });

      expect(actual).toBe(expected);
    });
  });
});
