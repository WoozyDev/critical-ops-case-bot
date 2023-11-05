import { config } from "dotenv";
import ClientBot from "./structs/ClientBot";

config();

new ClientBot().start(process.env.token);