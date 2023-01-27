// Search Kitsu for a manga
const kitsu = require("node-kitsu");

exports.run = async (client, roomId, args) => {
  const aniname = args.join(" ");
  if (!aniname) return client.sendText(roomId, "Please specify a manga name.");

  let results;
  try {
    client.logger.debug(`Search started for search term "${aniname}"`);
    results = await kitsu.searchManga(aniname, 0);
  }
  catch (ex) {
    client.logger.error(`${ex}`);
    return client.sendText(roomId, "An error occurred running this command");
  }
  if (!results || !results[0]) {
    client.sendText(roomId, "No results found");
    client.logger.warn(`No manga found for the search term "${aniname}"`);
  }
  const aniresult = results[0].attributes;

  const posterUrl = await client.uploadContentFromUrl(aniresult.posterImage.small);
  const embed = {
    "title": aniresult.titles.en || aniresult.canonicalTitle || aniresult.titles.en_jp,
    "url": `https://kitsu.io/manga/${aniresult.slug}`,
    "body": client.cleanSyn(aniresult.synopsis),
    "image": posterUrl,
    "fields": [
      {"name": "Rating:", "value": `${aniresult.averageRating || 0}% Approval`},
      {"name": "Chapters:", "value":  `${aniresult.chapterCount || 0} (${aniresult.subtype})`},
      {"name": "Status:", "value": aniresult.status == "tba" ? "TBA" : `${aniresult.status.toProperCase()}`}
    ]
  };
  await client.sendHtmlText(roomId, client.genEmbed(embed));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "manga",
  category: "Kitsu",
  description: "Show information about an anime on Kitsu.",
  usage: "manga [name]"
};