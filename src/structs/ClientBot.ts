import { Client, GatewayIntentBits } from "discord.js";

export default class ClientBot extends Client {

    static bot: ClientBot;
    constructor() {
        super({
            intents: [...Object.values(GatewayIntentBits) as any]
        });
        ClientBot.bot = this;
        // TODO: initialize commands collection
        // TODO: initialize ItemDefintionManager
        // TODO: initialize UserManager
        // TODO: initialize CaseManager
    }

    start(token: string) {
        this.login(token);
        // TODO: EventHandler
    }

}