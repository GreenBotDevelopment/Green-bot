import { Command } from "../../abstract/QuickCommand";
export default class textChannels extends Command {
    get name() {
        return "maxsongs";
    }
    get description() {
        return "Set the max number of songs that can be queued for everyone or per user";
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
                name: "user",
                description: "To edit the number of songs an user can queue",
                type: 1,
                options: [
                    {
                        name: "songs",
                        description: "The maximum number of songs that can be added by an user in the queue",
                        type: 4, 
                        required: true
                    }
                ]
            },

             {
                name: "global",
                description: "To edit the maximum size of a queue",
                type: 1,
                options: [
                    {
                        name: "songs",
                        description: "The maximum number of songs that can be added to the queue",
                        type: 4, 
                        required: true
                    }
                ]
            },

        ];
    }
    async run({ ctx: e }) {
        const sub = e.args[0].name;
        if(!e.guildDB.max_songs) e.guildDB.max_songs = { user: -1, guild: 10000}
        if(sub === "user"){
            const nb_songs = e.args[0].options[0].value;
            if(nb_songs > e.guildDB.max_songs.guild) return e.errorMessage("The maximum number of song you set is higher than the maximum size of queue. Try with another value or increase this limit")
             e.guildDB.max_songs.user = Math.ceil(nb_songs);
             console.log(e.guildDB.max_songs.user)
             e.client.database.handleCache(e.guildDB);
             return e.successMessage(`The maximum number of songs per user is now set to **${e.guildDB.max_songs.user}**\nThis mean that an user can't add more than ${e.guildDB.max_songs.user} in a queue`)
        }else{
            const nb_songs = e.args[0].options[0].value;
             e.guildDB.max_songs.guild = Math.ceil(nb_songs);
             e.client.database.handleCache(e.guildDB);
             return e.successMessage(`The maximum number of songs in a queue is now set to **${e.guildDB.max_songs.guild}**\nThis mean that a queue can't have more than ${e.guildDB.max_songs.guild} songs`)
        }
    }

}
