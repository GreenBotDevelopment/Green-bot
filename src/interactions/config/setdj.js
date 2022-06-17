const BaseCommand = require("../../abstract/BaseCommand.js");
class Volume extends BaseCommand {
    get name() {
        return "setdj";
    }
    get description() {
        return "Sets the DJ role.";
    }
    get category() {
        return "Admin Commands";
    }
    get permissions() {
        return ["MANAGE_GUILD"];
    }
    get aliases() {
        return ["dj", "djrole"];
    }
    get arguments() {
        return [{ name: "role", type: 8, description: "The role you want to set as DJ role", required: !0 }];
    }
    async run({ ctx: e }) {
        if ("disable" === e.args[0].value || "@everyone" === e.args[0].value || "reset" === e.args[0].value)
            return null === e.guildDB.dj_role ? e.errorMessage("The dj role is not already set.") : ((e.guildDB.dj_role = null), e.client.mongoDB.handleCache(e.guildDB), e.successMessage("The DJ role has been successfully disabled on this server!"));
        const r = e.interaction.options.getRole("role")
        return !r || r.managed || r.guild.id !== e.guild.id ?
            e.errorMessage("Please provide a valid role or a valid role ID.") :
            e.guildDB.dj_role && e.guildDB.dj_role === r.id ?
            e.errorMessage("The DJ role is already set to this role!") :
            ((e.guildDB.dj_role = r.id), e.client.mongoDB.handleCache(e.guildDB), e.successMessage(`The new Dj role is now ${r}! \nNote that every member with this role will be able to manage the music!`));
    }
}
module.exports = Volume;