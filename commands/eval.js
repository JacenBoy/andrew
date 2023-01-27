// The EVAL command will execute **ANY** arbitrary javascript code given to it.
// THIS IS PERMISSION LEVEL 10 FOR A REASON! It's perm level 10 because eval
// can be used to do **anything** on your machine, from stealing information to
// purging the hard drive. DO NOT LET ANYONE ELSE USE THIS

// However it's, like, super ultra useful for troubleshooting and doing stuff
// you don't want to put in a command.

exports.run = async (client, roomId, args) => {
  const code = args.join(" ");
  try {
    const evaled = eval(code);
    client.sendHtmlText(roomId, `<code class="language-javascript">${evaled}</code>`);
  }
  catch (ex) {
    client.sendHtmlText(roomId, `<p><b>ERROR:</b></p><p>${ex}</p>`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Owner"
};

exports.help = {
  name: "eval",
  category: "System",
  description: "Evaluates arbitrary javascript.",
  usage: "eval [...code]"
};