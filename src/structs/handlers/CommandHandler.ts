import { readdir } from "fs";
import ClientBot from "../ClientBot";
import { Constants } from "../Constants";
import Command from "./Command";

export const CommandHandler = {
    run: (client: ClientBot) => {
        readdir(`./${Constants.source}/commands`, (err, files) => {
            files.forEach(file => {
                if(!file.endsWith(Constants.file)) return;
                let cmd = require(`../../commands/${file}`);
                if(!cmd || !cmd.default) return;
                let command = new cmd.default();
                if(command instanceof Command) {
                    client.application.commands.create({
                        name: command.name,
                        description: command.description,
                        options: command.args as any
                    }).then(() => {
                        console.log(`Loaded command '${command.name}'`);
                        client.commands.set(command.name, command);
                    }).catch((err) => console.error(err));
                }
            })
        })
    }
}