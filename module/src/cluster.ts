import { BaseDiscordClient } from "./BaseDiscordClient";
import config from "../config";

const client = new BaseDiscordClient(config);

client.listenners(config.debug);
client.init();


