import { Constants } from "eris";

class Argument{
    name:string;
    required:boolean;
    description: string;
}

class CommandCheck{
    vote: boolean;
    premium: boolean;
    voice: boolean;
    channel: boolean;
    dispatcher: boolean;
}

export class BaseCommand {
    name: string;
    permissions: Array<string>;
    description: string;
    checks: CommandCheck;
    aliases: Array<string>;
    arguments: Array<Argument>;
    run: Function;

    constructor(commandData) {
    }
}
