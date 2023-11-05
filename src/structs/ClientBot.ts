import { Client, Collection, GatewayIntentBits } from "discord.js";
import Command from "./handlers/Command";
import { EventHandler } from "./handlers/EventHandler";
import ItemDefinitionManager from "./managers/ItemDefinitionManager";

export default class ClientBot extends Client {

    static bot: ClientBot;
    static owner: string;
    commands: Collection<string, Command>;
    defs: ItemDefinitionManager;
    constructor() {
        super({
            intents: [...Object.values(GatewayIntentBits) as any]
        });
        ClientBot.bot = this;
        ClientBot.owner = '723553355753848832';
        this.commands = new Collection();
        this.defs = new ItemDefinitionManager();
        this.defs.initialize();
        // TODO: initialize UserManager
        // TODO: initialize ProfileManager
        // TODO: initialize CaseManager
    }

    start(token: string) {
        this.login(token);
        EventHandler.run(this);
    }

}