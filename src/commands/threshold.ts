import {
  ButtonInteraction,
  CommandInteraction,
  MessageButton,
  MessageActionRow,
  User,
  GuildMember,
} from "discord.js";
import {
  ButtonComponent,
  Discord,
  Permission,
  Slash,
  SlashGroup,
  SlashOption,
} from "discordx";
import { read, write } from "../store";

@Discord()
@SlashGroup("threshold")
@Permission(false) // Disable for everyone.
@Permission({ id: "913838064818864229", type: "USER", permission: true }) // Operator's user ID, for debug and stuff. Remove if needed.
@Permission({ id: "907372554841366568", type: "ROLE", permission: true }) // Moderator role
class ModeratorThresholdCommand {
  @Slash("set")
  async set(
    @SlashOption("level", { required: true, type: "NUMBER" })
    level: number,
    interaction: CommandInteraction
  ) {
    await write("threshold", level.toString());

    interaction.reply({
      content: `You have changed the auto-ban threshold to ${level}. **Only new joiners will be affected, no preexisting members will be banned.**`,
    });
  }

  @Slash("get")
  async get(interaction: CommandInteraction) {
    let level: string = (await read("threshold")) || 3;

    interaction.reply({
      content: `Auto-ban threshold is at ${level}. **Only new joiners are affected, no preexisting members will be banned.**`,
    });
  }
}
