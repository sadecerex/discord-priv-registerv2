const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionsBitField } = require('discord.js');
const { rolver1, rolver2, rolver3, rexstaff } = require('../config.json');

module.exports = {
    name: 'rolver',
    description: 'Belirttiğin kullanıcıya roller verir.',
    
    async execute(message, args) {
        try {
            
            const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);

           
            if (!target) return message.reply("Lütfen geçerli bir kullanıcı ID'si veya @etiket belirtin.");

           
            const hasAdminPermission = message.member.permissions.has(PermissionsBitField.Flags.Administrator);
            const hasRexStaffRole = message.member.roles.cache.has(rexstaff);

            
            if (!hasAdminPermission && !hasRexStaffRole) {
                return message.reply("Bu komutu kullanmak için yönetici veya 'rexstaff' rolüne sahip olmalısınız.");
            }

            
            const roleIds = [rolver1, rolver2, rolver3, rolver4, rolver5, rolver6];

           
            const roles = roleIds.map(roleId => {
                const role = message.guild.roles.cache.get(roleId);
                return role ? { label: role.name, value: role.id } : null;
            }).filter(role => role !== null); 

            
            if (roles.length === 0) {
                return message.reply("Belirtilen rolleri bulamadım. Lütfen config.json'daki rol ID'lerini kontrol edin.");
            }

            
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('select_roles')
                .setPlaceholder('Roller seçin')
                .setMinValues(1)
                .setMaxValues(roles.length)
                .addOptions(
                    roles.map(role => new StringSelectMenuOptionBuilder().setLabel(role.label).setValue(role.value))
                );

            const row = new ActionRowBuilder().addComponents(selectMenu);

            
            const messageMenu = await message.reply({
                content: `Lütfen ${target.user.tag} için roller seçin:`,
                components: [row]
            });

           
            const filter = i => i.customId === 'select_roles' && i.user.id === message.author.id;
            const collector = messageMenu.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async interaction => {
                await interaction.deferUpdate(); 

                const selectedRoles = interaction.values;
                const rolePromises = selectedRoles.map(roleId => target.roles.add(roleId));
                
                try {
                    await Promise.all(rolePromises);
                    await message.reply(`Başarıyla ${target.user.tag} kullanıcısına seçilen roller verildi.`);
                } catch (error) {
                    console.error(error);
                    await message.reply('Roller verilirken bir hata oluştu.');
                }
            });

            
            collector.on('end', collected => {
                if (collected.size === 0) {
                    messageMenu.edit({ content: 'Süre doldu, roller seçilmedi.', components: [] });
                }
            });

        } catch (error) {
            
            
            return message.reply("Komut çalıştırılırken bir hata oluştu. Lütfen geçerli bir kişi belirtin.");
        }
    }
};
