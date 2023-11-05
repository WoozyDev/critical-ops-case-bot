import ClientBot from "../structs/ClientBot";
import { CommandHandler } from "../structs/handlers/CommandHandler";
import Event from "../structs/handlers/Event";

export default class ReadyEvent extends Event {

    constructor() {
        super('ready');
    }

    async run(client: ClientBot): Promise<void> {
        console.log(`Logged in as ${client.user.tag}`);
        CommandHandler.run(client);
    }

}