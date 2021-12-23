import { GuildMember } from "discord.js";

// @ts-ignore
let { search } = require("homoglyph-search");

const snowbankNameCheck = (value: string): boolean =>
  search(value, ["snowbank", "sb", "snow"]);

const suspiciousNameCheck = (value: string): boolean =>
  search(value, [
    "official",
    "admin",
    "moderator",
    "support",
    "dao",
    "labs",
    "announce",
  ]);

const teamNameCheck = (value: string): boolean =>
  search(value, ["rollan", "yeti", "snafu", "violet", "morridin", "white"]);

function normalize(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .toLowerCase();
}

export function check(member: GuildMember): [number, string[]] {
  // Suspiciousness score.
  let score = 0;
  let suspiciousElements = [];

  let user = member.user;

  // New account? (< 1 week)
  if (Date.now() - user.createdAt.valueOf() < 604800000) {
    score++;
    suspiciousElements.push("Account made less than a week ago (+1)");
  }

  // normalize
  let parsedLowercaseUsername = normalize(user.username);

  console.log(
    "User's name (after normalization) is " + parsedLowercaseUsername
  );

  // Contains Snowbank in name?
  if (snowbankNameCheck(parsedLowercaseUsername)) {
    score++;
    suspiciousElements.push("Contains Snowbank, Snow or SB in name (+1)");
  }

  // Contains "Support", "Official" or any other suspicious thing?
  if (suspiciousNameCheck(parsedLowercaseUsername)) {
    score++;
    suspiciousElements.push(
      "Contains 'Official', 'Support', 'Admin', 'Moderator', 'Announce', 'Labs' or 'DAO' in name (+1)"
    );
  }

  // Contains a moderator's name?
  if (teamNameCheck(parsedLowercaseUsername)) {
    score += 2;
    suspiciousElements.push("Contains team member's username in name (+2)");
  }

  return [score, suspiciousElements];
}
