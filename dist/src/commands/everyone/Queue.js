"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
const ExtendedDispatcher_1 = require("../../modules/ExtendedDispatcher");
class Queue extends QuickCommand_1.Command {
    get name() {
        return "queue";
    }
    get description() {
        return "Shows the current queue for this guild!";
    }
    get aliases() {
        return ["q", "songs"];
    }
    get category() {
        return "Everyone Commands";
    }
    get checks() {
        return { voice: false, dispatcher: true, };
    }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (e.dispatcher.queue.length > 6) {
                const t = e.dispatcher.queue.slice(0, 6);
                let u = 0, a = 6, n = 1;
                const i = yield e.send({
                    embeds: [
                        {
                            author: { name: `Queue for ${e.guild.name} (${e.dispatcher.queue.length} songs)`, icon_url: e.author.dynamicAvatarURL() },
                            fields: [
                                { name: "• Now playing", value: `[${e.dispatcher.current.info.title.slice(0, 40)}](https://discord.gg/greenbot) [${(0, ExtendedDispatcher_1.humanizeTime)(e.dispatcher.current.info.length)}]` },
                                { name: "• Up next", value: t.map((e, t) => `**${t + 1})** [${e.info.title.slice(0, 40)}](https://discord.gg/greenbot) (Requested by \`${e.info.requester ? e.info.requester.name : "Unknow"}\`)`).join("\n") },
                                { name: "• Settings", value: `Repeat Mode: ${e.dispatcher.repeat} | Dj: <@${e.dispatcher.metadata.dj}> | Volume: ${100 * e.dispatcher.player.filters.volume}` },
                            ],
                            color: 0x3a871f,
                        },
                    ],
                    components: [
                        {
                            components: [
                                { custom_id: "save_pl", label: "Save Queue", style: 3, type: 2 },
                                { custom_id: "clear_queue", label: "Clear Queue", style: 4, type: 2 },
                                { emoji: { name: "⏮", id: null }, custom_id: "back_queue", style: 2, type: 2 },
                                { emoji: { name: "⏭", id: null }, custom_id: "next_queue", style: 2, type: 2 },
                            ],
                            type: 1,
                        },
                    ],
                }), r = (e) => e.data && "back_queue" === e.data.custom_id || e.data && "next_queue" === e.data.custom_id;
                e.client.collectors.create({
                    channelId: e.channel.id,
                    time: 60000,
                    type: "button",
                    filter: r,
                    end: (x) => {
                        i.edit({
                            embeds: [
                                {
                                    author: { name: `Queue for ${e.guild.name} (${e.dispatcher ? e.dispatcher.queue.length : "0"} songs)`, icon_url: e.author.dynamicAvatarURL() },
                                    fields: [
                                        { name: "• Now playing", value: `[${e.dispatcher && e.dispatcher.current ? e.dispatcher.current.info.title.slice(0, 40) : " Nothing Playing!"}](https://discord.gg/greenbot) [00:00]` },
                                        {
                                            name: "• Up next",
                                            value: e.dispatcher && e.dispatcher.queue.length ? e.dispatcher.queue
                                                .slice(0, 6)
                                                .map((e, t) => `**${t + 1})** [${e.info.title.slice(0, 40)}](https://discord.gg/greenbot) (Requested by \`${e.info.requester ? e.info.requester.name : "Unknow"}\`)`)
                                                .join("\n") : "Nothing next! add some songs to start the party!",
                                        },
                                        { name: "• Settings", value: `Repeat Mode: ${e.dispatcher ? e.dispatcher.repeat : "No"} | Dj: <@${e.dispatcher ? e.dispatcher.metadata.dj : "No queue"}> | Volume: ${100 * e.dispatcher ? e.dispatcher.player.filters.volume : 1}` },
                                    ],
                                    color: 0x3a871f,
                                },
                            ],
                            components: [
                                {
                                    components: [
                                        { custom_id: "save_pl", label: "Save Queue", style: 3, type: 2 },
                                        { custom_id: "clear_queue", label: "Clear Queue", style: 4, type: 2 },
                                        { emoji: { name: "⏮", id: null }, disabled: true, custom_id: "back_queue", style: 2, type: 2 },
                                        { emoji: { name: "⏭", id: null }, disabled: true, custom_id: "next_queue", style: 2, type: 2 },
                                    ],
                                    type: 1,
                                },
                            ],
                        });
                    },
                    exec: (t) => __awaiter(this, void 0, void 0, function* () {
                        yield t.defer();
                        if ((t.deleteOriginalMessage(), t.member.id === e.author.id)) {
                            if ("back_queue" === t.data.custom_id) {
                                if (((a -= 6), (n -= 1), (u -= 6) < 0))
                                    return;
                                if (n < 1)
                                    return;
                                const t = e.dispatcher.queue
                                    .map((e, t) => `**${t + 1})** [${e.info.title.slice(0, 40)}](https://green-bot.app) (Requested by \`${e.info.requester ? e.info.requester.name : "Unknow"}\`)`)
                                    .slice(u, a)
                                    .join("\n");
                                i.edit({
                                    embeds: [
                                        {
                                            author: { name: `Queue for ${e.guild.name} (${e.dispatcher.queue.length} songs)`, icon_url: e.author.dynamicAvatarURL() },
                                            fields: [
                                                { name: "• Now playing", value: `[${e.dispatcher.current.info.title.slice(0, 40)}](https://discord.gg/greenbot) [${(0, ExtendedDispatcher_1.humanizeTime)(e.dispatcher.current.info.length)}]` },
                                                { name: "• Up next", value: t },
                                                { name: "• Settings", value: `Repeat Mode: ${e.dispatcher.repeat} | Dj: <@${e.dispatcher.metadata.dj}> | Volume: ${100 * e.dispatcher.player.filters.volume}` },
                                            ],
                                            color: 0x3a871f,
                                        },
                                    ],
                                    components: [
                                        {
                                            components: [
                                                { custom_id: "save_pl", label: "Save Queue", style: 3, type: 2 },
                                                { custom_id: "clear_queue", label: "Clear Queue", style: 4, type: 2 },
                                                { emoji: { name: "⏮", id: null }, custom_id: "back_queue", style: 2, type: 2 },
                                                { emoji: { name: "⏭", id: null }, custom_id: "next_queue", style: 2, type: 2 },
                                            ],
                                            type: 1,
                                        },
                                    ],
                                });
                            }
                            if ("next_queue" === t.data.custom_id) {
                                if (((u += 6), (n += 1), (a += 6) > e.dispatcher.queue.length + 6))
                                    return;
                                if (u < 0)
                                    return;
                                const t = e.dispatcher.queue
                                    .map((e, t) => `**${t + 1})** [${e.info.title.slice(0, 40)}](https://discord.gg/greenbot) (Requested by \`${e.info.requester ? e.info.requester.name : "Unknow"}\`)`)
                                    .slice(u, a)
                                    .join("\n");
                                i.edit({
                                    embeds: [
                                        {
                                            author: { name: `Queue for ${e.guild.name} (${e.dispatcher.queue.length} songs)`, icon_url: e.author.dynamicAvatarURL() },
                                            fields: [
                                                { name: "• Now playing", value: `[${e.dispatcher.current.info.title.slice(0, 40)}](https://discord.gg/greenbot) [${(0, ExtendedDispatcher_1.humanizeTime)(e.dispatcher.current.info.length)}]` },
                                                { name: "• Up next", value: t },
                                                { name: "• Settings", value: `Repeat Mode: ${e.dispatcher.repeat} | Dj: <@${e.dispatcher.metadata.dj}> | Volume: ${100 * e.dispatcher.player.filters.volume}` },
                                            ],
                                            color: 0x3a871f,
                                        },
                                    ],
                                    components: [
                                        {
                                            components: [
                                                { custom_id: "save_pl", label: "Save Queue", style: 3, type: 2 },
                                                { custom_id: "clear_queue", label: "Clear Queue", style: 4, type: 2 },
                                                { emoji: { name: "⏮", id: null }, custom_id: "back_queue", style: 2, type: 2 },
                                                { emoji: { name: "⏭", id: null }, custom_id: "next_queue", style: 2, type: 2 },
                                            ],
                                            type: 1,
                                        },
                                    ],
                                });
                            }
                        }
                    })
                });
            }
            else {
                const t = e.dispatcher.queue;
                e.send({
                    embeds: [
                        {
                            author: { name: `Queue for ${e.guild.name} (${e.dispatcher.queue.length} songs)`, icon_url: e.author.dynamicAvatarURL() },
                            fields: [
                                { name: "• Now playing", value: `[${e.dispatcher.current.info.title.slice(0, 40)}](https://discord.gg/greenbot) [${(0, ExtendedDispatcher_1.humanizeTime)(e.dispatcher.current.info.length)}]` },
                                {
                                    name: "• Up next",
                                    value: e.dispatcher.queue.length > 0
                                        ? t.map((e, t) => `**${t + 1})** [${e.info.title.slice(0, 50)}](https://discord.gg/greenbot) (Requested by \`${e.info.requester ? e.info.requester.name : "Unknow"}\`)`).join("\n")
                                        : `There are no songs in the queue yet! Add one using \`/play <music>\`!`,
                                },
                                { name: "• Settings", value: `Repeat Mode: ${e.dispatcher.repeat} | Dj: <@${e.dispatcher.metadata.dj}> | Volume: ${100 * e.dispatcher.player.filters.volume}` },
                            ],
                            color: 0x3a871f,
                        },
                    ],
                    components: [
                        {
                            components: [
                                { custom_id: "save_pl", label: "Save Queue", style: 3, type: 2 },
                                { custom_id: "clear_queue", label: "Clear Queue", style: 4, type: 2 },
                            ],
                            type: 1,
                        },
                    ],
                });
            }
        });
    }
}
exports.default = Queue;
