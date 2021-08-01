const hasAlphaNumericCharacter = require('../alpha-numeric');
const isProfane = require('../profanity/index');
const {
  createInvalidResult,
  createValidResult,
} = require('../validation-result');

const TopicErrorCode = {
  TOPIC_REQUIRED: 'TOPIC_REQUIRED',
  NAME_REQUIRED: 'NAME_REQUIRED',
  NAME_LENGTH: 'NAME_LENGTH',
  NAME_NO_ALPHA_NUMERIC: 'NAME_NO_ALPHA_NUMERIC',
  NAME_PROFANITY: 'NAME_PROFANITY',
  SLUG_REQUIRED: 'SLUG_REQUIRED',
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
 * Validate a topic.
 * @param {object} topic The topic to validate.
 * @return {object} The topic validation result.
 */
function validateTopic(topic) {
  if (!topic) {
    return createInvalidResult(
      TopicErrorCode.TOPIC_REQUIRED,
      'Topic is required.'
    );
  }

  const { name, slug } = topic;

  if (!name) {
    return createInvalidResult(
      TopicErrorCode.NAME_REQUIRED,
      'Topic name is required.'
    );
  }

  if (exceedsMaxLength(name, NAME_MAX_LENGTH)) {
    return createInvalidResult(
      TopicErrorCode.NAME_LENGTH,
      `Topic name exceeds max length of ${NAME_MAX_LENGTH}.`
    );
  }

  if (!hasAlphaNumericCharacter(name)) {
    return createInvalidResult(
      TopicErrorCode.NAME_NO_ALPHA_NUMERIC,
      'Topic name must contain an alpha numeric character.'
    );
  }

  if (isProfane(name)) {
    return createInvalidResult(
      TopicErrorCode.NAME_PROFANITY,
      'Topic name cannot contain profanity.'
    );
  }

  if (!slug) {
    return createInvalidResult(
      TopicErrorCode.SLUG_REQUIRED,
      'Topic slug is required.'
    );
  }

  return createValidResult();
}

module.exports = validateTopic;
