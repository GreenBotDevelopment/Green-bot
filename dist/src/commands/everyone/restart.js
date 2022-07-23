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
        return "restart";
    }
    get description() {
        return "Sends in DM the current track";
    }
    get aliases() {
        return ["e"];
    }
    get checks() {
        return { premium: true };
    }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () {
            if ("688402229245509844" !== e.author.id && "772850214318768138" !== e.author.id && "660477458209964042" !== e.author.id)
                return e.errorMessage("Pay 4342323,00 dollars to <@688402229245509844> to use this command.");
            e.client.cluster.send("restart");
        });
    }
}
exports.default = Queue;
