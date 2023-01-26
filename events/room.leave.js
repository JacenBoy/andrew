// This event executes when a new room is left.

module.exports = async (client, roomId, event) => {
  return client.logger.log(`Bot has left room "${roomId}"`);
};