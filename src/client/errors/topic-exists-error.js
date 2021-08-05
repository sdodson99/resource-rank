export default class TopicExistsError extends Error {
  constructor(message, topicName) {
    super(message);

    this.name = 'TopicExistsError';
    this.topicName = topicName;
  }
}
