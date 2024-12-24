const { rexstaff, ucube } = require('../config.json');
const UcubeList = require('../models/ucubeList');

module.exports = {
    name: 'ucubeiptal',
    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR') && !message.member.roles.cache.has(rexstaff)) {
            return message.reply('Bu komutu kullanma yetkiniz yok.');
        }

        const rex = args[0]?.replace(/[<@!>]/g, '');
        if (!rex) {
            return message.reply('Ucubelikten çıkarmak istediğiniz kişiyi etiketleyin veya kullanıcı ID\'sini girin.');
        }

        const member = await message.guild.members.fetch(rex).catch(() => null);
        if (!member) {
            return message.reply('Belirtilen kullanıcı bulunamadı.');
        }

        
        await UcubeList.findOneAndDelete({ userId: member.user.id });

        
        const ucubeRole = message.guild.roles.cache.get(ucube);
        if (member.roles.cache.has(ucubeRole.id)) {
            await member.roles.remove(ucubeRole);
        }

        message.channel.send(`${member.user.tag} ucubelikten çıkarıldı.`);
    },
};
