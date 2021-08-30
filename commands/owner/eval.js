const Discord = require('discord.js');
const util = require("util")
module.exports = {
        name: 'eval',
        description: 'Evalue une variable',
        aliases: ['e', 'evaluate'],
        usage: '<code>',
        cooldown: 5,
        guildOnly: true,
        owner: true,
        args: true,
        cat: 'owner',
        async execute(message, args, client, guildDB) {
            var code = args.join(" ");
            try {
                const ev = eval(code);
                let str = util.inspect(ev, {
                    depth: 1,
                });

                str = `${str.replace(new RegExp(`${message.client.token}`, "g"), "TOKEN")}`;

			if(str.length > 1914) {
				str = str.substr(0, 1914);
				str = str + "...";
			}
			if(code.length > 1914) {
				code = code.substr(0, 1914);
				code = "Bruh, your code is very long.";
			}
            const embed = new Discord.MessageEmbed()
            .setColor(message.guild.settings.color)
            .setDescription(`\`\`\`js\n${clean(str)}\n\`\`\``)
            .addField("Code", `\`\`\`js\n${code}\n\`\`\``)
            .addField("Type of:", typeof(str))

            .setFooter(message.client.footer)
        message.reply({ embeds: [embed],allowedMentions: { repliedUser: false }
 })
		}
		catch (error) {
			const embed = new Discord.MessageEmbed()
            .setColor(message.guild.settings.color)
            .setDescription(`\`\`\`js\n${error}\n\`\`\``)
            .addField("Code", `\`\`\`js\n${code}\n\`\`\``)
            .addField("Type of:", typeof(str))

            .setFooter(message.client.footer)
        message.reply({ embeds: [embed],allowedMentions: { repliedUser: false }
 })
		}

        function clean(text) {
            if (typeof(text) === 'string')
                return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
            else
                return text;
        }
    },
};