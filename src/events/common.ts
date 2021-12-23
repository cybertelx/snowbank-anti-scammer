import type { ArgsOf } from "discordx";
import { Discord, On, Client } from "discordx";
import { read } from "../store";
import { check } from "../checks";

@Discord()
export abstract class DiscordEvents {
  @On("guildMemberAdd")
  async guildMemberAdd([member]: ArgsOf<"guildMemberAdd">, client: Client) {
    console.log("New guild member added! Scanning...");

    let [score, suspiciousElements] = check(member);

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
