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
class Reset extends QuickCommand_1.Command {
    get name() { return "resetfilters"; }
    get description() { return "Clears all filters"; }
    get aliases() { return ["clearfilters", "reset"]; }
    get category() { return "Filters"; }
    get checks() { return { voice: true, dispatcher: true, channel: true }; }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () { e.dispatcher.player.clearFilters(), e.successMessage("All filters have been cleared!"); });
    }
}
exports.default = Reset;
