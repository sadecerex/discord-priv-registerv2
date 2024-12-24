const { kayitsiz, rexdev } = require('../config.json');
const BanList = require('../models/banList'); 

module.exports = {
    name: 'yargı',
    async execute(message, args) {
        if (message.author.id !== rexdev) {
            return message.channel.send('Bu komutu kullanma yetkiniz yok.');
        }

        const targetUser = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null);
        if (!targetUser) {
            return message.channel.send('Yasaklanacak kullanıcıyı belirtmelisiniz.');
        }

        const guildMember = await message.guild.members.fetch(targetUser.id).catch(() => null);
        if (!guildMember) {
            return message.channel.send('Belirtilen kullanıcı sunucuda bulunamadı.');
        }

      
        await guildMember.ban({ reason: 'Yasaklı listesine eklendi.' }).catch(err => {
            console.error('Kullanıcı yasaklanamadı:', err);
            return message.channel.send('Kullanıcı yasaklanırken bir hata oluştu.');
        });

        
        const banEntry = new BanList({ userId: targetUser.id });
        await banEntry.save().catch(err => {
            if (err.code === 11000) {
                console.log('Kullanıcı zaten yasaklı listesinde.');
            } else {
                console.error('MongoDB kaydetme hatası:', err);
            }
        });

        message.channel.send(`<@${targetUser.id}> kullanıcısı başarıyla yasaklandı ve yasaklı listesine eklendi!`);
    },
};
