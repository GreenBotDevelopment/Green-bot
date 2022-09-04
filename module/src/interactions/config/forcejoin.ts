import { Command } from "../../abstract/QuickCommand";
export default class Skip extends Command {
    get name() {
        return "forcejoin";
    }
    get description() {
        return "Fixes every single problem with the player";
    }
    get category() {
        return "Admin Commands";
    }
    get checks() {
        return { voice: true, };
    }
    async run({ ctx: e }) {
        if(!e.member.permissions.has("manageMessages")) return e.errorMessage("You need manage messages perms for this command!")
        if(e.dispatcher) return e.errorMessage("There's already a dispatcher!")
        const node = e.client.shoukaku.getNode()
      try {
        const pl =   await node.joinChannel({
            guildId: e.guild.id,
            shardId: e.guild.shard.id,
            channelId: e.member.voiceState.channelID,
            deaf: true
        }).catch(()=>{
            return e.errorMessage("You made an error while setting up your permissions so i can't join you voice channel. You can fix it guicky by going to server settings => roles => Green-bot and grant admin permission.")

        })
      } catch (error) {
        return e.errorMessage("You made an error while setting up your permissions so i can't join you voice channel. You can fix it guicky by going to server settings => roles => Green-bot and grant admin permission.")
      }
      const queue = await e.client.queue.create(e, node)
        return e.successMessage("Joined your vc!")

    }
}
