import { CommandInteraction, CacheType, CommandInteractionOptionResolver, Colors } from "discord.js";
import ClientBot from "../structs/ClientBot";
import Command from "../structs/handlers/Command";

export default class HelpCommand extends Command {

    constructor() {
        super('help', 'get information about Case Bot');
    }
    
    async run(client: ClientBot, interaction: CommandInteraction<CacheType>, options: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage">): Promise<void> {
        await interaction.reply({
            embeds: [{
                title: `Case Bot Project`,
                description: [
                    `**What is Case Bot?**`,
                    `This is a bot which simulates the way you open or get cases in-game, but also credits.`,
                    ``,
                    `**Does this give me credits in-game?**`,
                    `No it doesn't.`,
                    ``,
                    `**What's the point of making this bot?**`,
                    `Just a fun little project to be working on.`,
                    ``,
                    `**How can I start using this bot?**`,
                    `You can start by creating a profile with \`/profile new\`. You can also switch profiles with \`/profile switch\`.`,
                    ``,
                    `[Github](https://github.com/WoozyDev/critical-ops-case-bot) | [Discord](https://discord.gg/NqSm4cd4Qd) | @woozy666`
                ].join('\n'),
                color: Colors.Blurple,
                timestamp: new Date().toString(),
                footer: {
                    text: `Made by @woozy666`
                }
            }]
        });
    }

}