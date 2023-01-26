module.exports = async (client, roomId, event) => {
  // Don't handle unhelpful events (ones that aren't text messages, are redacted, or sent by us)
  if (event['content']?.['msgtype'] !== 'm.text') return;
  if (event['sender'] === await client.getUserId()) return;

  // Load the message sender and content into their own more readable variables
  const message = event["content"]["body"];
  const sender = event["sender"];

  // Check if the message starts with our prefix
  if (!message.startsWith(client.config.prefix)) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Check whether the command, or alias, exist in the collections defined
  // in app.js.
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  // using this const varName = thing OR otherThing; is a pretty efficient
  // and clean way to grab one of 2 values!
  if (!cmd) return;

  // Check to make sure that the command is enabled
  if (!cmd.conf.enabled) return;

  // Check to make sure the user has permission to run the command
  if (!client.checkPermissions(cmd.conf.permLevel, sender));

  // If we've passed all these checks, it's probably okay to run the command
  try {
    await cmd.run(client, roomId, args);
  }
  catch (ex) {
    client.sendText(roomId, "An error ocurred running this command");
    client.logger.error(ex);
  }
};