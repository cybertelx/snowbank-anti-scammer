import type { ArgsOf } from "discordx";
import { Discord, On, Client } from "discordx";
import { read } from "../store";

@Discord()
export abstract class DiscordEvents {
  @On("guildMemberAdd")
  async guildMemberAdd([member]: ArgsOf<"guildMemberAdd">, client: Client) {
    console.log("New guild member added! Scanning...");

    // Suspiciousness score.
    let score = 0;
    let suspiciousElements = [];

    let user = member.user;

    // New account? (< 1 week)
    if (Date.now() - user.createdAt.valueOf() < 604800000) {
      score++;
      suspiciousElements.push("Account made less than a week ago (+1)");
    }

    // get rid of ZWSPs and remove fancy accents
    let parsedLowercaseUsername = user.username
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .toLowerCase();

    const snowbankNameCheck = (value: string) =>
      ["snowbank", "sb", "snow"].some((element) => value.includes(element));

    const suspiciousNameCheck = (value: string) =>
      [
        "official",
        "admin",
        "moderator",
        "support",
        "dao",
        "labs",
        "announce",
      ].some((element) => value.includes(element));

    const teamNameCheck = (value: string) =>
      ["rollan", "yeti", "snafu", "violet", "morridin", "white"].some(
        (element) => value.includes(element)
      );

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

    let banString = `Score ${score}, triggered checks: ${suspiciousElements.join(
      ", "
    )}`;
    console.log(banString);

    console.log("Threshold at level " + Number((await read("threshold")) || 3));
    if (score >= Number((await read("threshold")) || 3)) {
      console.log("Suspicious user detected.");
      if (member.bannable) {
        console.log("Suspicious user banned.");
        try {
          await member.send({
            content: `We're sorry. Your account was flagged as suspicious (potentially a scammer) and has been banned.\n\nPlease contact Snowbank support through other means if you believe this was issued in error.`,
          });
        } catch (e) {}

        await member.ban({
          reason: banString,
        });
      }
    }
  }
}
