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
class Queue extends QuickCommand_1.Command {
    get name() {
        return "pl-create";
    }
    get description() {
        return "Creates a playlist";
    }
    get aliases() {
        return ["pl", "playlist"];
    }
    get category() {
        return "Everyone Commands";
    }
    get arguments() {
        return [
            { name: "playlist_name", description: "The name of the playlist you want to create", required: true, type: 3 },
        ];
    }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () {
            const a = e.args[0].value;
            if (a.length < 3 || a.length > 50)
                return e.errorMessage("The playlist name must be beetween 2 and 50 long.");
            const s = yield e.client.database.getUser(e.author.id);
            return (s && s.playlists.find((e) => e.name === a)) || "all" === a
                ? e.errorMessage("You already have a playlist with this name or you can't use this name.")
                : s && s.playlists.length >= 5 && !(yield e.client.database.checkPremium(e.guild.id, e.author.id))
                    ? e.errorMessage("You have reached the maximun playlist limit!\n Please upgrade to the [Premium](https://green-bot.app/premium) to create more playlists!")
                    : void setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        return (s.playlists.push({ name: a, tracks: [] }), s.save(),
                            e.successMessage(`Created a playlist with the name **${a}** ${`\n\n__How it works?__\n\n• You can add tracks to this playlist using the \`/pl-add\` command!\n• You can play your playlist using the \`/pl-play ${a}\` command.`}`));
                    }), 500);
        });
    }
}
exports.default = Queue;
