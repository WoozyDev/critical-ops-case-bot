import { ClientEvents } from "discord.js";
import ClientBot from "../ClientBot";

export default class Event {

    name: keyof ClientEvents;
    constructor(name: keyof ClientEvents) {
        this.name = name;
    }

    async run(client: ClientBot, ...args: any) {}
    
}