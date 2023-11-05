import { CacheType, Interaction } from "discord.js";
import ClientBot from "../structs/ClientBot";
import Event from "../structs/handlers/Event";

export default class InteractionCreateEvent extends Event {

    constructor() {
        super('interactionCreate');
    }
    
    async run(client: ClientBot, interaction: Interaction<CacheType>): Promise<void> {
        if(interaction.isCommand()) {
            let command = client.commands.get(interaction.commandName);
            if(command) command.run(client, interaction, interaction.options as any);
        }
    }

}