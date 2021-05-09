export default function getErrorCode(apolloError) {
  const { graphQLErrors } = apolloError;

  if (!graphQLErrors) {
    return null;
  }

  const hasErrors = graphQLErrors.length > 0;

  if (!hasErrors) {
    return null;
  }

  const errorCode = graphQLErrors[0]?.extensions?.code;

  return errorCode;
}
