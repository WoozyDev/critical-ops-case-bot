import { Client, Collection, GatewayIntentBits } from "discord.js";
import Command from "./handlers/Command";
import { EventHandler } from "./handlers/EventHandler";

export default class ClientBot extends Client {

    static bot: ClientBot;
    static owner: string;
    commands: Collection<string, Command>;
    constructor() {
        super({
            intents: [...Object.values(GatewayIntentBits) as any]
        });
        ClientBot.bot = this;
        ClientBot.owner = '723553355753848832';
        this.commands = new Collection();
        // TODO: initialize ItemDefintionManager
        // TODO: initialize UserManager
        // TODO: initialize ProfileManager
        // TODO: initialize CaseManager
    }

    start(token: string) {
        this.login(token);
        EventHandler.run(this);
    }

}