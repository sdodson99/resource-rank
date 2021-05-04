import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../../../components/layout/layout';
import LiveValidatingInput from '../../../components/live-vaildating-input/live-validating-input';
import { Link } from 'gatsby';

function NewTopicResource({ topicId }) {
  const submit = () => {};

  return (
    <Layout>
      <div className="page-header text-center text-sm-start">New Resource</div>

      <form onSubmit={submit}>
        <div className="mt-4">
          <label htmlFor="name">Name</label>
          <LiveValidatingInput
            id="name"
            required={true}
            validationErrorMessage="Resource name already exists."
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

NewTopicResource.propTypes = {
  topicId: PropTypes.string,
};

export default NewTopicResource;
