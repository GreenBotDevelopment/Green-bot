import { Command } from "../../abstract/QuickCommand";
export default class textChannels extends Command {
    get name() {
        return "leave-channel";
    }
    get description() {
        return "Changes if the bot should leave when there is no music or channel is empty ( just skips the 5m cooldown )";
    }
    get category() {
        return "Admin Commands";
    }
    get permissions() {
        return ["manageGuild"];
    }
    get arguments() {
        return [

            {
                name: "no-music",
                description: "To enable/disable the bot leaving when there is no music",
                type: 1,
                options: [

                ]
            },

            {
                name: "channel_empty",
                description: "If you want to make the bot leaving the voice channel as soon as the last member leaves",
                type: 1,
                options: [

                ]
            },

        ];
    }
    async run({ ctx: e }) {
        const sub = e.args[0].name;
        if (!e.guildDB.leave_settings) e.guildDB.leave_settings = { no_music: false, channel_empty: false }
        if (sub === "no-music") {
            if (e.guildDB.leave_settings.no_music) {
                e.guildDB.leave_settings.no_music =false;
                e.client.database.handleCache(e.guildDB);
                return e.successMessage(`The bot won't leave the channel anymore as long as the music stops!`)

            } else {
                   e.guildDB.leave_settings.no_music =true;
                e.client.database.handleCache(e.guildDB);
                return e.successMessage(`From now on the bot will leave the channel as long as the music stops!`)

            }
        } else {
              if (e.guildDB.leave_settings.channel_empty) {
                e.guildDB.leave_settings.channel_empty =false;
                e.client.database.handleCache(e.guildDB);
                return e.successMessage(`The bot won't leave the channel anymore as long as it's empty!`)

            } else {
                   e.guildDB.leave_settings.channel_empty =true;
                e.client.database.handleCache(e.guildDB);
                return e.successMessage(`From now on the bot will leave the channel as long as it's enmpty!`)

            }
        }
    }

}
