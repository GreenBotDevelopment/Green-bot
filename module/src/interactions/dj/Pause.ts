import { Command } from "../../abstract/QuickCommand";
export default class Pause extends Command {
    get name() {
        return "pause";
    }
    get description() {
        return "Pauses the current playback!";
    }
    get category() {
        return "Queue Management";
    }
    get checks() {
        return { voice: true, dispatcher: true, channel: true };
    }
    run({ ctx: e }) {
        return (
            e.client.queue._sockets.find((s) => s.serverId === e.guild.id) &&
                e.client.queue._sockets
                    .filter((s) => s.serverId === e.guild.id)
                    .forEach((s) => {
                        e.client.queue.emitOp({ changes: ["CURRENT_SONG"], socketId: s.id, serverId: e.guild.id, queueData: { current: e.dispatcher.current, paused: !e.dispatcher.player.paused, loop: "queue" === e.dispatcher.repeat } });
                    }),
            e.dispatcher.lastMessage &&
                e.client.editMessage(e.dispatcher.channelId, e.dispatcher.lastMessage, {
                    components: [
                        {
                            components: [
                                { custom_id: "back_button", label: "Back", style: 3, type: 2 },
                                { custom_id: "stop", label: "Stop", style: 4, type: 2 },
                                { custom_id: "pause_btn", label: e.dispatcher.player.paused ? "Pause" : "Resume", style: 1, type: 2 },
                                { custom_id: "skip", label: "Skip", style: 3, type: 2 },
                                { custom_id: "like", emoji: { name: "❤", id: null }, style: 2, type: 2 },
                            ],
                            type: 1,
                        },
                    ],
                }),
            e.dispatcher.player.paused ? (e.dispatcher.pause(false), e.successMessage("▶ Music unpaused!")) : (e.dispatcher.pause(true), e.successMessage("⏸ Music paused!"))
        );
    }
}
