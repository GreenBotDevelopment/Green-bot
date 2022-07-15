import { Constants } from "eris";
import { Command } from "../../abstract/QuickCommand";
export default class Stop extends Command {
    get name() {
        return "join";
    }
    get description() {
        return "Joins your voice channel";
    }
    get aliases() {
        return ["connect", "summon"];
    }
    get category() {
        return "Everyone Commands";
    }
    get checks() {
        return { voice: true, channel: true };
    }
    async run({ ctx: e }) {
        if (!e.me.voiceState.channelID) {
            const channel = await e.getVoiceChannel();
            if(channel.userLimit == channel.voiceMembers.size) return e.errorMessage("I can't join your channel because the member limit ( Set by a server admin) has been reached! Please increase it or kick someone.")
            if (!e.client.hasBotPerm(e, "voiceConnect", channel))
                return e.errorMessage(
                    "I don't have the required permissions to join your voice channel! I need `View Channels`, `Connect` and `Speak` permission. [Permissions Example](https://cdn.discordapp.com/attachments/904438715974287440/909076558558412810/unknown.png)\n If the problem persists, change the voice channel region to `Europe`"
                );
            if (!e.client.hasBotPerm(e, "voiceSpeak", channel))
                return e.errorMessage(
                    "I don't have the permission to speak in your voice channel.\n Please give me the permission to or check this guide to learn how to give me this permissions:\nhttps://guide.green-bot.app/frequent-issues/permissions"
                );
            if (e.guildDB.vcs.length && !e.guildDB.vcs.includes(e.member.voiceState.channelID))
                return e.errorMessage(
                    e.guildDB.vcs.length > 1
                        ? `I am not allowed to play music in your voice channel.\n Please join one of the following channels: ${e.guildDB.vcs.map((e) => `<#${e}>`).join(",")}`
                        : `I can only play music in the <#${e.guildDB.vcs[0]}> channel.`
                );
        }
        const n = e.client.shoukaku.getNode();
        if (e.dispatcher) e.successMessage(`Connected in <#${e.member.voiceState.channelID}>\n\n🆕 You can now manage the music easily from the [Dashboard](https://dash.green-bot.app/app/${e.guild.id})`);
        const queue = await e.client.queue.create(e, n)
        if (!queue) return e.errorMessage("**Uh Oh..**! Something went wrong while joining your voice channel.\nYou can do the command again or use the `"+e.guildDB.prefix+"forcejoin` command to solve the issue");
    }
}
