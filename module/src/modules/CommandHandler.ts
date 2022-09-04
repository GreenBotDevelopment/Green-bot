import { readdirSync } from "fs";
import { BaseDiscordClient } from "../BaseDiscordClient";
import { BaseCommand } from "../abstract/BaseCommand";

export class CommandLoader {
    client: BaseDiscordClient;
    commands: Array<any>;
    slash: Array<any>;
    constructor(client: BaseDiscordClient) {
        this.client = client;
        this.commands = [];
        this.slash = [];
        this.build("commands");
        setTimeout(() => {
            this.build("interactions")
        }, 2000)
    }
    get list() {
        return this.commands
    }
    public reload() {
        this.commands = [];
        this.slash = [];
        this.build("commands", true);
        setTimeout(() => {
            this.build("interactions", true)
        }, 2000);
        return { commands: this.commands.length, slash: this.slash.length }
    }

    build(type: "commands" | "interactions", reload?: boolean) {
        const files = readdirSync(`${this.client.location}/module/src/${type}`, { withFileTypes: true });
        files.forEach(cat => {
            const dirFiles = readdirSync(`${this.client.location}/module/src/${type}/${cat.name}`, { withFileTypes: true });
            dirFiles.forEach(async cmd => {
                if (cmd.name.endsWith(".map")) return;
                try {
                    if (reload) delete require.cache[require.resolve(`${this.client.location}/module/src/${type}/${cat.name}/${cmd.name}`)];
                    const command = new ((await import(`${this.client.location}/module/src/${type}/${cat.name}/${cmd.name}`)).default)
                    type === "commands" ? this.commands.push(command) : this.slash.push(command)
                } catch (error) {
                    console.log(`[Command Handler] Cannot load file ${cmd.name}. Missing export default?: ${error}`)
                }

            })
        })
    }

    getCommand(name: string) {
        return this.commands.find(cmd => cmd.name === name) || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(name))
    }

    getSlash(name: string) {
        return this.slash.find(cmd => cmd.name === name)
    }

    addCommand(command: BaseCommand, type: "commands" | "interactions") {
        return type === "commands" ? this.commands.push(command) : this.slash.push(command)
    }

    removeCommand(commandName: string) {
        let index = this.commands.findIndex(cmd => cmd.name === commandName)
        if (!index || index == -1) return new Error("[CommandHandler] Requested to remove command but the name was not found: " + commandName + "");
        this.commands.slice(index, 1);
        return true
    }
}


