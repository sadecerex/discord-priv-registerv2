const { rexstaff, vip, emojitik } = require('../config.json');

module.exports = {
    name: 'vip',
    async execute(message, args) {
        if (!message.member.roles.cache.has(rexstaff) && !message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send('Bu komutu kullanmak için gerekli yetkin yok.');
        }

        const rex = args[0]?.replace(/[<@!>]/g, '');
        if (!rex) {
            return message.channel.send('Lütfen Vip vermek istediğiniz kişiyi etiketleyin ya da kullanıcı id\'sini giriniz.');
        }

        const member = await message.guild.members.fetch(rex).catch(() => null);
        if (!member) {
            return message.channel.send('Belirtilen kullanıcı bulunamadı.');
        }

        const rexvip = message.guild.roles.cache.get(vip);
        if (!rexvip) {
            return message.channel.send('Rol bulunamadı.');
        }

        try {
            await member.roles.add([rexvip]);
            await message.react(emojitik);
        } catch (error) {
            console.error('Rol eklenirken bir hata oluştu:', error);
            message.channel.send('Bir hata oluştu. Roller eklenemedi.');
        }
    },
};
