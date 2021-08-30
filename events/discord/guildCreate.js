require("../../util/extenders.js");
module.exports = {
    async execute(e, r) {
        console.log("[32m%s[0m", "NOUVEAU SERVEUR ", "[0m", `${e.name} [${e.memberCount.toLocaleString()} Members]\nID: ${e.id}`)
        let findData = await e.fetchDB()
        if (!findData) {
            findData = await e.addDB()
        }
    }
};