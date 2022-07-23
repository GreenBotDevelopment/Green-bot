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
class Volume extends QuickCommand_1.Command {
    get name() {
        return "defaultvolume";
    }
    get description() {
        return "Sets the default volume for the bot";
    }
    get category() {
        return "Admin Commands";
    }
    get permissions() {
        return ["manageGuild"];
    }
    get arguments() {
        return [{ name: "volume", description: "The new default volume", required: true }];
    }
    static inRange(e, t, r) {
        return (e - t) * (e - r) <= 0;
    }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = e.args[0];
            if (isNaN(t) || !Volume.inRange(t, 1, 200))
                return e.errorMessage("The volume you provided is incorrect. It must be a number beetwen **1** and **200**");
            (e.guildDB.defaultVolume = parseInt(t)), e.client.database.handleCache(e.guildDB), e.successMessage("The default volume has been set to **" + t + "**.");
        });
    }
}
exports.default = Volume;
