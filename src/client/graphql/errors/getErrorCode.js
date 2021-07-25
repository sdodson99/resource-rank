export default function getErrorCode(error) {
  const errors = error.response?.errors;

  if (!Array.isArray(errors)) {
    return null;
  }

  if (errors.length === 0) {
    return null;
  }

  return errors[0].extensions?.code;
}
