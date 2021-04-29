import React, { useEffect, useRef, useState } from 'react';
import { Link, navigate } from 'gatsby';
import Layout from '../../components/layout/layout';
import topicExistsQuery from '../../gql-requests/topic-exists-query';
import useCreateTopicMutation from '../../hooks/use-create-topic-mutation';
import { useApolloClient } from '@apollo/client';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';

function CreateTopic() {
  const [name, setName] = useState('');
  const [nameExists, setNameExists] = useState(false);

  const { current: nameInputSubject } = useRef(new Subject());
  const apolloClient = useApolloClient();

  const doesTopicNameExist = async (nameInput) => {
    return await apolloClient.query({
      query: topicExistsQuery,
      variables: {
        name: nameInput,
      },
      fetchPolicy: 'no-cache',
    });
  };

  useEffect(() => {
    const subscription = nameInputSubject
      .pipe(
        debounceTime(1000),
        switchMap(doesTopicNameExist),
        map((result) => result.data?.topicExists)
      )
      .subscribe((topicExistsResult) => {
        console.log(topicExistsResult);
        setNameExists(topicExistsResult);
      });

    return () => subscription.unsubscribe();
  }, []);

  const handleNameInput = (e) => {
    setNameExists(false);

    const nameInput = e.target.value;

    setName(nameInput);
    nameInputSubject.next(nameInput);
  };

  const createTopic = useCreateTopicMutation();
  const submit = async (e) => {
    e.preventDefault();

    await createTopic(name);

    navigate('/');
  };

  return (
    <Layout>
      <div className="page-header text-center text-sm-start">Create Topic</div>

      <form onSubmit={submit}>
        <div className="mt-4">
          <label htmlFor="name">Name</label>
          <input
            required
            id="name"
            value={name}
            onChange={handleNameInput}
            className="mt-1 form-control"
            type="text"
          />
          {nameExists && (
            <div className="mt-2 fs-6 text-danger">
              Topic name already exists.
            </div>
          )}
        </div>

        <div className="mt-4 row align-items-center">
          <div className="col-sm-auto">
            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={nameExists}
            >
              Submit
            </button>
          </div>
          <div className="col-sm-auto mt-3 mt-sm-0">
            <Link to="/" className="btn btn-outline-danger w-100">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </Layout>
  );
}

export default CreateTopic;
