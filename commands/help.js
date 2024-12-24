const { EmbedBuilder } = require('discord.js');
const {rexhelpgif, rexfooter, prefix} = require('../config.json');

module.exports = {
    name: 'help',
    description: 'Botun tüm komutlarini ve açiklamalarini listeler.',

    async execute(message) {
        
        const helpEmbed = new EmbedBuilder()
            .setColor('#0099ff') 
            .setTitle('Komut Yardim Menüsü')
            .setThumbnail(rexhelpgif)
            .setImage(rexhelpgif)
            .setDescription('Botun kullanilabilir tüm komutlarinin listesi:')
            .addFields(
                
                { name: `${prefix}kayit <@Kullanici/ID>`, value: 'Belirttiğiniz Kullaniciyi Sunucuya Kayit eder' },
                { name: `${prefix}ucube <@Kullanici/ID>`, value: 'Belirttiğiniz Kullaniciyi Ucube Ilan Eder.' },
                { name: `${prefix}ucubeiptal <@Kullanici/ID>`, value: 'Belirttiğiniz kullaniciyi ucubelikten çıkarır.' },
                { name: `${prefix}vip`, value: 'Belirtilen Kişiye Vip Rolü Verir.' },  
                { name: `${prefix}otover`, value: 'Rolü Bulunmayan Kişilere Kayıtsız Rolü Verir.' },  
                { name: `${prefix}rolal <@Kullanici/ID>`, value: 'Belirttiğiniz kullaniciya roller verir.' },  
                { name: `${prefix}rolver <@Kullanici/ID>`, value: 'Belirttiğiniz kullanicidan roller alir.' },
                { name: `${prefix}yargı <@Kullanici/ID>`, value: 'Belirttiğiniz kullaniciyi açılmayacak şekilde yasaklar.' }
                
            )
            .setFooter({ text: rexfooter });

        
        await message.reply({ embeds: [helpEmbed] });
    }
};


