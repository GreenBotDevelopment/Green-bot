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
class giveDj extends QuickCommand_1.Command {
    get name() {
        return "givedj";
    }
    get description() {
        return "Gives the dj of the queue to another user";
    }
    get category() {
        return "Queue Management";
    }
    get checks() {
        return { voice: false, dispatcher: true, };
    }
    get arguments() {
        return [{ name: "user", type: 6, description: "The user who you want to give the DJ", required: true }];
    }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (e.dispatcher.metadata.dj !== e.author.id)
                return e.errorMessage("You must be the DJ of the current queue to use this command");
            const r = yield e.guild.getRESTMember(e.args[0]);
            if (!r || r.bot || r.id === e.author.id)
                return e.errorMessage("Please provide a valid user from this server.");
            (e.dispatcher.metadata.dj = r.id), e.successMessage(`The DJ of the queue is now ${r}`);
        });
    }
}
exports.default = giveDj;
