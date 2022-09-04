import  { REST } from '@discordjs/rest';
import  { Routes } from 'discord-api-types/v9';
import { readdirSync } from "fs";
import config from "./config";


export async function refresh(clientId: string) {
    const commands = [];
    const files = readdirSync(`${__dirname}/src/interactions`, { withFileTypes: true });
    files.forEach(cat => {
        const dirFiles = readdirSync(`${__dirname}/src/interactions/${cat.name}`, { withFileTypes: true });
        dirFiles.forEach(async cmd => {
            if (cmd.name.endsWith(".map")) return;
            try {
                const command = new ((await import(`${__dirname}/src/interactions/${cat.name}/${cmd.name}`)).default)
                if(command.name === "setprefix") return
                commands.push({
                    name: command.name,
                    description: command.description,
                    options: command.arguments,
                })
            
            } catch (error) {
                console.log(`[Command Handler] Cannot load file ${cmd.name}. Missing export default?: ${error}`)
            }

        })
    })

  setTimeout(async() => {
    const rest = new REST({ version: '9' }).setToken(config.token);
    try {
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
    } catch (error) {
        console.error(error);
    }
  }, 5000);
    return commands.length;
}