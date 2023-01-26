// This event executes when a new room is joined.

module.exports = async (client, roomId, event) => {
  return client.logger.log(`Bot has joined room "${roomId}"`);
};