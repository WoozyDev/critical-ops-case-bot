import { readdir } from "fs";
import ClientBot from "../ClientBot";
import { Constants } from "../Constants";
import Event from "./Event";

export const EventHandler = {
    run: (client: ClientBot) => {
        readdir(`./${Constants.source}/events`, (err, files) => {
            files.forEach(file => {
                if(!file.endsWith(Constants.file)) return;
                let ev = require(`../../events/${file}`);
                if(!ev || !ev.default) return;
                let event = new ev.default();
                if(event instanceof Event) {
                    client.on(event.name, event.run.bind(null, client));
                    console.log(`Loaded event '${event.name}'`);
                }
            })
        })
    }
}