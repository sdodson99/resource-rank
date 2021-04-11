import React, { useState } from 'react';
import { Link, navigate } from 'gatsby';
import Layout from '../../components/layout/layout';
import useCreateTopicMutation from '../../hooks/use-create-topic-mutation';

function CreateTopic() {
  const [name, setName] = useState('');
  const handleNameInput = (e) => setName(e.target.value);

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
        </div>

        <div className="mt-4 row align-items-center">
          <div className="col-sm-auto">
            <button className="btn btn-primary w-100" type="submit">
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
