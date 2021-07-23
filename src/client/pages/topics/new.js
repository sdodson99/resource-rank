import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import BreadcrumbLayout from '../../components/BreadcrumbLayout/BreadcrumbLayout';
import Head from 'next/head';
import useTopicExistsQuery from '../../hooks/use-topic-exists-query';
import { useForm } from 'react-hook-form';
import useCreateTopicMutation from '../../hooks/use-create-topic-mutation';

const FormField = {
  NAME: 'name',
};

export default function NewTopic() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const [createTopicError, setCreateTopicError] = useState();

  const { execute: executeTopicExistsQuery } = useTopicExistsQuery();
  const { execute: executeCreateTopicMutation } = useCreateTopicMutation();

  const onSubmit = async (formData) => {
    const name = formData[FormField.NAME]
    
    console.log(name);
    // await executeCreateTopicMutation(name);
    // router.push('/topics');
  };

  const nameError = errors[FormField.NAME]?.message;

  const breadcrumbs = [
    {
      to: '/topics',
      title: 'Topics',
    },
    {
      to: '/topics/new',
      title: 'New',
    },
  ];

  return (
    <BreadcrumbLayout breadcrumbs={breadcrumbs}>
      <Head>
        <title>New Topic - Resource Rank</title>
      </Head>

      <div className="text-4xl">New Topic</div>

      <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <label htmlFor={FormField.NAME}>Name</label>
          <input
            className="mt-2 form-control flex-grow"
            type="text"
            {...register(FormField.NAME, {
              required: 'Required',
            })}
          />

          {nameError && (
            <div className="mt-2 error-text text-sm">{nameError}</div>
          )}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row">
          <button className="btn btn-primary w-100" type="submit">
            Submit
          </button>
          <button className="mt-3 btn btn-danger-outline w-100 sm:mt-0 sm:ml-3">
            <Link href="/topics">Cancel</Link>
          </button>
        </div>

        <div className="text-center text-sm-start">
          {createTopicError && (
            <div className="mt-4 text-danger">Failed to create topic.</div>
          )}
        </div>
      </form>
    </BreadcrumbLayout>
  );
}
