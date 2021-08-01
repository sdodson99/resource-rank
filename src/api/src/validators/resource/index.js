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
    return createInvalidResult(ResourceErrorCode.RESOURCE_REQUIRED);
  }

  const { name, slug, link } = resource;

  if (!name) {
    return createInvalidResult(ResourceErrorCode.NAME_REQUIRED);
  }

  if (exceedsMaxLength(name, NAME_MAX_LENGTH)) {
    return createInvalidResult(ResourceErrorCode.NAME_LENGTH);
  }

  if (!hasAlphaNumericCharacter(name)) {
    return createInvalidResult(ResourceErrorCode.NAME_NO_ALPHA_NUMERIC);
  }

  if (isProfane(name)) {
    return createInvalidResult(ResourceErrorCode.NAME_PROFANITY);
  }

  if (!slug) {
    return createInvalidResult(ResourceErrorCode.SLUG_REQUIRED);
  }

  if (!link) {
    return createInvalidResult(ResourceErrorCode.LINK_REQUIRED);
  }

  if (!isURL(link)) {
    return createInvalidResult(ResourceErrorCode.LINK_INVALID_URL);
  }

  return createValidResult();
}

module.exports = validateResource;
