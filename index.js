// Load the Matrix SDK library
const Andrew = require("./base/Andrew");
const {AutojoinRoomsMixin} = require("matrix-bot-sdk");
// Load the libraries we'll need for the event loader
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`,
// or `bot.something`, this is what we're refering to. Your client.
const client = new Andrew(require("./config.json"));

// We're doing real fancy node 8 async/await stuff here, and to do that
// we need to wrap stuff in an anonymous function. It's annoying but it works.

const init = async () => {
  // Here we load **commands** into memory, as a collection, so they're accessible
  // here and everywhere else.
  const cmds = await readdir("./commands/");
  client.logger.log(`Loading a total of ${cmds.length} commands`);
  cmds.forEach(c => {
    if (!c.endsWith(".js")) return;
    const response = client.loadCommand(c);
    if (response) console.log(response);
  });

  // Then we load events, which will include our message and ready event.
  const evtFiles = await readdir("./events/");
  client.logger.log(`Loading a total of ${evtFiles.length} events`);
  evtFiles.forEach(file => {
    const eventName = file.split(".js")[0];
    client.logger.log(`Loading Event: ${eventName}`);
    const event = require(`./events/${file}`);
    // Bind the client to any event, before the existing arguments
    // provided by the discord.js event. 
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, event.bind(null, client));
  });

  // We'll set the bot to automatically join any room requests it receives
  AutojoinRoomsMixin.setupOnClient(client);

  // Now start the client
  client.start().then(() => {
    client.logger.log("Bot has started", "ready");
  });

// End top-level async/await function.
};

init();

/* MISCELANEOUS NON-CRITICAL FUNCTIONS */

// EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
// later, this conflicts with native code. Also, if some other lib you use does
// this, a conflict also occurs. KNOWING THIS however, the following 2 methods
// are, we feel, very useful in code. 

// <String>.toProperCase() returns a proper-cased string such as: 
// "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
Object.defineProperty(String.prototype, "toProperCase", {
  value: function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
});

// <Array>.random() returns a single random element from an array
// [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
Object.defineProperty(Array.prototype, "random", {
  value: function() {
    return this[Math.floor(Math.random() * this.length)];
  }
});

// These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
process.on("uncaughtException", (err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  client.logger.error(`Uncaught Exception: ${errorMsg}`);
  // Always best practice to let the code crash on uncaught exceptions. 
  // Because you should be catching them anyway.
  // That said, YOLO
  //process.exit(1);
});

process.on("unhandledRejection", (reason, p) => {
  client.logger.error(`Unhandled rejection: \n${reason}\nStack:\n${reason.stack}\nPromise:\n${require("util").inspect(p, { depth: 2 })}`);
});