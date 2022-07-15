import { Command } from "../../abstract/QuickCommand";
export default class Volume extends Command {
    get name() {
        return "leavecleanup";
    }
    get description() {
        return "Removes all songs from users that are not in the voice channel";
    }
    get aliases() {
        return ["lc"];
    }
    get category() {
        return "Queue Management";
    }
    get checks() {
        return { voice: true, dispatcher: true, channel: true, premium: true };
    }
    async run({ ctx: e }) {
        e.successMessage("⏱ Removing songs from users that are no longer in the vc. Please wait");
        const channel = e.guild.channels.get(e.dispatcher.player.connection.channelId)
        if (channel.type !== 2) return null;
        const r = channel.voiceMembers.filter(m => !m.bot);
        let s = 0;
        if (
            (e.dispatcher.queue.forEach((n) => {
                n.info.requester && (r.find((e) => e.user.id === n.info.requester.id) || (e.dispatcher.remove(n, true), s++));
            }),
                e.client.queue._sockets.find((r) => r.serverId === e.guild.id))
        ) {
            e.client.queue._sockets
                .filter((r) => r.serverId === e.guild.id)
                .forEach((r) => {
                    e.client.queue.emitOp({ changes: ["NEXT_SONGS"], socketId: r.id, serverId: e.guild.id, queueData: { incoming: e.dispatcher.queue } });
                });
        }
        e.successMessage(`I removed **${s}** songs from users that are no longer in the voice channel!`);
    }
}
