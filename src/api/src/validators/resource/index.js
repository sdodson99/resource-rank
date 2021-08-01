const hasAlphaNumericCharacter = require('../alpha-numeric');
const isProfane = require('../profanity/index');
const {
  createInvalidResult,
  createValidResult,
} = require('../validation-result');
const { isURL } = require('validator');

const ResourceErrorCode = {
  RESOURCE_REQUIRED: 'RESOURCE_REQUIRED',
  NAME_REQUIRED: 'NAME_REQUIRED',
  NAME_LENGTH: 'NAME_LENGTH',
  NAME_NO_ALPHA_NUMERIC: 'NAME_NO_ALPHA_NUMERIC',
  NAME_PROFANITY: 'NAME_PROFANITY',
  SLUG_REQUIRED: 'SLUG_REQUIRED',
  LINK_REQUIRED: 'LINK_REQUIRED',
  LINK_INVALID_URL: 'LINK_INVALID_URL',
};

const NAME_MAX_LENGTH = 50;

/**
 * Check if a string exceeds the max length.
 * @param {string} value The string to check.
 * @param {number} maxLength The max string length.
 * @return {boolean} True/false for exceeds max length.
 */
function exceedsMaxLength(value, maxLength) {
  return value.length > maxLength;
}

/**
 * Validate a resource.
 * @param {object} resource The resource to validate.
 * @return {object} The resource validation result.
 */
function validateResource(resource) {
  if (!resource) {
    return (
      createInvalidResult(ResourceErrorCode.RESOURCE_REQUIRED),
      'Resource is required.'
    );
  }

  const { name, slug, link } = resource;

  if (!name) {
    return createInvalidResult(
      ResourceErrorCode.NAME_REQUIRED,
      'Resource name is required.'
    );
  }

  if (exceedsMaxLength(name, NAME_MAX_LENGTH)) {
    return createInvalidResult(
      ResourceErrorCode.NAME_LENGTH,
      `Resource name exceeds max length of ${NAME_MAX_LENGTH}.`
    );
  }

  if (!hasAlphaNumericCharacter(name)) {
    return createInvalidResult(
      ResourceErrorCode.NAME_NO_ALPHA_NUMERIC,
      'Resource name must contain an alpha numeric character.'
    );
  }

  if (isProfane(name)) {
    return createInvalidResult(
      ResourceErrorCode.NAME_PROFANITY,
      'Resource name cannot contain profanity.'
    );
  }

  if (!slug) {
    return createInvalidResult(
      ResourceErrorCode.SLUG_REQUIRED,
      'Resource slug is required.'
    );
  }

  if (!link) {
    return createInvalidResult(
      ResourceErrorCode.LINK_REQUIRED,
      'Resource link is required.'
    );
  }

  if (!isURL(link)) {
    return createInvalidResult(
      ResourceErrorCode.LINK_INVALID_URL,
      'Resource link must be a valid URL.'
    );
  }

  return createValidResult();
}

module.exports = validateResource;
