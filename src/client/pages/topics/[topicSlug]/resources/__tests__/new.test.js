import getTopicBySlug from '@/services/topics/graphql-topic-by-slug-service';
import { when } from 'jest-when';
import { getServerSideProps } from '../new.page';

jest.mock('@/services/topics/graphql-topic-by-slug-service');

describe('<NewTopicResource />', () => {
  describe('getServerSideProps', () => {
    let req;
    let params;
    let topicSlug;

    beforeEach(() => {
      req = {};
      topicSlug = 'topic-name';
      params = {
        topicSlug,
      };
    });

    afterEach(() => {
      getTopicBySlug.mockReset();
    });

    it('should return not found if topic query fails', async () => {
      when(getTopicBySlug)
        .calledWith(topicSlug)
        .mockImplementation(() => {
          throw new Error();
        });

      const { notFound } = await getServerSideProps({ req, params });

      expect(notFound).toBeTruthy();
    });

    describe('when successful', () => {
      let id;
      let name;
      let slug;

      beforeEach(() => {
        id = '123';
        name = 'name';
        slug = 'slug';
      });

      it('should return topic props', async () => {
        when(getTopicBySlug).calledWith(topicSlug).mockReturnValue({
          id,
          name,
          slug,
        });

        const { props } = await getServerSideProps({ req, params });

        expect(props).toEqual({
          topicId: id,
          topicName: name,
          topicSlug: slug,
        });
      });
    });
  });
});
