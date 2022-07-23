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
        return "pl-delete";
    }
    get description() {
        return "Deletes a playlist";
    }
    get aliases() {
        return ["pl-del", "pl-delete"];
    }
    get category() {
        return "Everyone Commands";
    }
    get arguments() {
        return [{ name: "playlist_name", description: "The name of the playlist you want to delete", required: true }];
    }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () {
            const s = e.args.join(" "), t = yield e.client.database.getUser(e.author.id);
            return "all" === s && t
                ? ((t.playlists = []), t.save(), e.successMessage("Deleted all your playlists!"))
                : t && t.playlists.find((e) => e.name === s)
                    ? ((t.playlists = t.playlists.filter((e) => e.name !== s)), t.save(), e.successMessage(`Deleted the playlist with the name **${s}** succesfully`))
                    : e.errorMessage(`You don't have any playlist called **${s}** yet!`);
        });
    }
}
exports.default = Queue;
