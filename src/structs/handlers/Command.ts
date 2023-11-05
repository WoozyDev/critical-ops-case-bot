import { APIApplicationCommandOption, CacheType, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import ClientBot from "../ClientBot";

export default class Command {

    name: string;
    description: string;
    args: APIApplicationCommandOption[];
    constructor(name: string, description: string, args: APIApplicationCommandOption[] = []) {
        this.name = name;
        this.description = description;
        this.args = args;
    }

    async run(client: ClientBot, interaction: CommandInteraction<CacheType>, options: Omit<CommandInteractionOptionResolver, 'getMessage'>) {}

}