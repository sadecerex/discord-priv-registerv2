const { rexstaff, ucube, booster, ucubegif, rexfooter } = require('../config.json');
const { EmbedBuilder } = require('discord.js');
const UcubeList = require('../models/ucubeList'); 

module.exports = {
    name: 'ucube',
    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR') && !message.member.roles.cache.has(rexstaff)) {
            return message.reply('Bu komutu kullanma yetkiniz yok.');
        }

        const ucuberole = message.guild.roles.cache.get(ucube);
        const boosterrole = message.guild.roles.cache.get(booster);

        const rex = args[0]?.replace(/[<@!>]/g, '');
        if (!rex) {
            return message.reply('Lütfen ucube ilan etmek istediğiniz kişiyi etiketleyin ya da kullanıcı id\'sini giriniz.');
        }

        const member = await message.guild.members.fetch(rex).catch(() => null);
        if (!member) {
            return message.reply('Belirtilen kullanıcı bulunamadı.');
        }

        const rolclear = member.roles.cache.filter(role => role.id !== boosterrole.id && role.id !== message.guild.id);
        await member.roles.remove(rolclear);
        await member.roles.add(ucuberole);

       
        const ucubeEntry = new UcubeList({ userId: member.user.id });
        await ucubeEntry.save().catch(err => {
            if (err.code === 11000) {
                console.log('Kullanıcı zaten ucube listesinde.');
            } else {
                console.error('MongoDB kaydetme hatası:', err);
            }
        });

        const ucubeembed = new EmbedBuilder()
          .setTitle('UCUBÈLER DİYARI')
          .setImage(ucubegif)
          .setDescription(`${member.user.tag} kullanıcısı <@&${ucube}>'ler diyarına gönderildi.`)
          .setFooter({ text: rexfooter });

        message.channel.send({ embeds: [ucubeembed] });
    },
};
