const config = require('./config.json');
const { MessageEmbed } = require('discord.js');
const emoji = require('./emojis.json')
class Command {
    constructor(client, options) {
        this.constructor.validateOptions(client, options);
        this.client = client;
        this.name = options.name;
        this.aliases = options.aliases || null;
        this.usage = options.usage || options.name;
        this.description = options.description || '';
        this.type = options.type || client.types.NFSW;
        this.clientPermissions = options.clientPermissions || ['SEND_MESSAGES', 'EMBED_LINKS'];
        this.userPermissions = options.userPermissions || null;
        this.examples = options.examples || null;
        this.ownerOnly = options.ownerOnly || false;
        this.disabled = options.disabled || false;
        this.errorTypes = ['Commande incorrect', 'Échec de la commande'];
    }



    getMemberFromMention(message, mention) {
        if (!mention) return;
        const matches = mention.match(/^<@!?(\d+)>$/);
        if (!matches) return;
        const id = matches[1];
        return message.guild.members.cache.get(id);
    }

    getRoleFromMention(message, mention) {
        if (!mention) return;
        const matches = mention.match(/^<@&(\d+)>$/);
        if (!matches) return;
        const id = matches[1];
        return message.guild.roles.cache.get(id);
    }

    getChannelFromMention(message, mention) {
        if (!mention) return;
        const matches = mention.match(/^<#(\d+)>$/);
        if (!matches) return;
        const id = matches[1];
        return message.guild.channels.cache.get(id);
    }

    checkPermissions(message, ownerOverride = true) {
        if (!message.channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])) return false;
        const clientPermission = this.checkClientPermissions(message);
        const userPermission = this.checkUserPermissions(message, ownerOverride);
        if (clientPermission && userPermission) return true;
        else return false;
    }

    checkUserPermissions(message, ownerOverride = true) {
            if (!this.ownerOnly && !this.userPermissions) return true;
            if (ownerOverride && this.client.isOwner(message.author)) return true;
            if (this.ownerOnly && !this.client.isOwner(message.author)) {
                return false;
            }

            if (message.member.hasPermission('ADMINISTRATOR')) return true;
            if (this.userPermissions) {
                const missingPermissions =
                    message.channel.permissionsFor(message.author).missing(this.userPermissions).map(p => permissions[p]);
                if (missingPermissions.length !== 0) {
                    const embed = new MessageEmbed()
                        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`${fail} Autorisations utilisateur manquantes: \`${this.name}\``)
                        .setDescription(`\`\`\`diff\n${missingPermissions.map(p => `- ${p}`).join('\n')}\`\`\``)
          .setFooter(config.footer)
          .setTimestamp()
          .setColor("#2f3136");
        message.channel.send(embed);
        return false;
      }
    }
    return true;
  }

  checkClientPermissions(message) {
    const missingPermissions =
      message.channel.permissionsFor(message.guild.me).missing(this.clientPermissions).map(p => permissions[p]);
    if (missingPermissions.length !== 0) {
      const embed = new MessageEmbed()
        .setAuthor(`${this.client.user.tag}`, message.client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`${fail} Permissions de bot manquantes: \`${this.name}\``)
        .setDescription(`\`\`\`diff\n${missingPermissions.map(p => `- ${p}`).join('\n')}\`\`\``)
        .setFooter(config.footer)
        .setTimestamp()
        .setColor("#2f3136");
      message.channel.send(embed);
      return false;

    } else return true;
  }
  
  sendErrorMessage(message,  commandname) {
    const commandName = commandname.toLowerCase();
    const command = message.client.commands.get(commandName) ||
        message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`${emoji.error}  | Erreur d'utlisation`)



            .addField("Un argument est attendu !", `\`\`\`diff\n${prefix}${command.name} ${command.usage}\`\`\``);

            if (command.exemple) reportEmbed.addField("Exemple", `\`\`\`diff\n${prefix}${command.name} ${command.exemple}\`\`\``)


            .setFooter(config.footer)

            .setColor(config.color);
            message.channel.send(reportEmbed);
            return;
  }
async sendModLogMessage(message, reason, fields = {}) {
    const modLogId = message.client.db.settings.selectModLogId.pluck().get(message.guild.id);
    const modLog = message.guild.channels.cache.get(modLogId);
    if (
      modLog && 
      modLog.viewable &&
      modLog.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {
      const caseNumber = await message.client.utils.getCaseNumber(message.client, message.guild, modLog);
      const embed = new MessageEmbed()
        .setTitle(`Action: \`${message.client.utils.capitalize(this.name)}\``)
        .addField('Par', message.member, true)
        .setFooter(`Case #${caseNumber}`)
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      for (const field in fields) {
        embed.addField(field, fields[field], true);
      }
      embed.addField('Raison', reason);
      modLog.send(embed).catch(err => message.client.logger.error(err.stack));
    }
  }

  static validateOptions(client, options) {

    if (!client) throw new Error('Aucun client n\'a été trouvé');
    if (typeof options !== 'object') throw new TypeError('Les options de commande ne sont pas un objet');

    if (typeof options.name !== 'string') throw new TypeError('Le nom de la commande n\'est pas une chaîne');
    if (options.name !== options.name.toLowerCase()) throw new Error('Le nom de la commande n\'est pas en minuscules');

    if (options.aliases) {
      if (!Array.isArray(options.aliases) || options.aliases.some(ali => typeof ali !== 'string'))
        throw new TypeError('Les alias de commande ne sont pas un tableau de chaînes');

      if (options.aliases.some(ali => ali !== ali.toLowerCase()))
        throw new RangeError('Les alias de commande ne sont pas en minuscules');

      for (const alias of options.aliases) {
        if (client.aliases.get(alias)) throw new Error('L\'alias de commande existe déjà');
      }
    }

    if (options.usage && typeof options.usage !== 'string') throw new TypeError('L\'utilisation de la commande n\'est pas une chaîne');

    if (options.description && typeof options.description !== 'string') 
      throw new TypeError('La description de la commande n\'est pas une chaîne');
    
    if (options.type && typeof options.type !== 'string') throw new TypeError('Le type de commande n\'est pas une chaîne');
    if (options.type && !Object.values(client.types).includes(options.type))
      throw new Error('Le type de commande n\'est pas valide');
    
    if (options.clientPermissions) {
      if (!Array.isArray(options.clientPermissions))
        throw new TypeError('La commande clientPermissions n\'est pas un tableau de chaînes de clés d\'autorisation');
      
      for (const perm of options.clientPermissions) {
        if (!permissions[perm]) throw new RangeError(`ClientPermission de commande non valide: ${perm}`);
      }
    }

    if (options.userPermissions) {
      if (!Array.isArray(options.userPermissions))
        throw new TypeError('La commande userPermissions n\'est pas un tableau de chaînes de clé d\'autorisation');

      for (const perm of options.userPermissions) {
        if (!permissions[perm]) throw new RangeError(`Commande userPermission non valide: ${perm}`);
      }
    }

    if (options.examples && !Array.isArray(options.examples))
      throw new TypeError('Les exemples de commande ne sont pas un tableau de chaînes de clé d\'autorisation');

    if (options.ownerOnly && typeof options.ownerOnly !== 'boolean') 
      throw new TypeError('La commande ownerOnly n\'est pas une valeur booléenne');

    if (options.disabled && typeof options.disabled !== 'boolean') 
      throw new TypeError('La commande désactivée n\'est pas un booléen');
  }
}

module.exports = Command;