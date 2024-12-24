const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'ayarmenü',
  description: 'Config ayarlarını menü ile değiştirir.',
  async execute(interaction) {
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      return interaction.reply({ content: 'Bu komutu kullanmak için yönetici olmalısınız!', ephemeral: true });
    }

    
    const options = [
      { label: "Ön eki değiştir", value: "prefix" },
      { label: "Botun aktivitesini değiştir", value: "Aktivite" },
      { label: "Twitch URL değiştir", value: "AktiviteURL" },
      { label: "Kayıtlı rolünü değiştir", value: "kayitli" },
      { label: "Kayıtsız rolünü değiştir", value: "kayitsiz" },
      { label: "VIP rolünü değiştir", value: "vip" },
      { label: "Yetkili rolünü değiştir", value: "rexstaff" },
      { label: "Ucube rolünü değiştir", value: "ucube" },
      { label: "Booster rolünü değiştir", value: "booster" },
      { label: "Emoji değiştir", value: "emojitik" },
      { label: "Ucube GIF değiştir", value: "ucubegif" },
      { label: "Yardım menüsü GIF", value: "rexhelpgif" },
      { label: "Footer değiştir", value: "rexfooter" },
      { label: "Denetim logu değiştir", value: "denetimlog" },
      { label: "Rol Menüsü 1", value: "rolver1" },
      { label: "Rol Menüsü 2", value: "rolver2" },
      { label: "Rol Menüsü 3", value: "rolver3" },
      { label: "Rol Menüsü 4", value: "rolver4" },
      { label: "Rol Menüsü 5", value: "rolver5" },
      { label: "Rol Menüsü 6", value: "rolver6" },
    ];

    const menu = new StringSelectMenuBuilder()
      .setCustomId('ayarMenuSec')
      .setPlaceholder('Bir ayar seçin')
      .addOptions(options);

    const row = new ActionRowBuilder().addComponents(menu);

    const embed = new EmbedBuilder()
      .setTitle('🔧 Ayar Menüsü')
      .setDescription('Aşağıdan bir ayar seçerek güncelleyebilirsiniz.')
      .setColor('#5865F2');

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  },
};


module.exports.selectHandler = async (interaction) => {
  const configPath = path.resolve(__dirname, '../config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const selectedKey = interaction.values[0];

  const modal = {
    title: `🔧 ${selectedKey} Ayarı`,
    custom_id: 'configModal',
    components: [
      {
        type: 1,
        components: [
          {
            type: 4,
            custom_id: 'configValue',
            label: `${selectedKey} için yeni değer girin:`,
            style: 1,
            required: true,
          },
        ],
      },
    ],
  };

  await interaction.showModal(modal);

  
  interaction.client.once('interactionCreate', async (modalInteraction) => {
    if (!modalInteraction.isModalSubmit()) return;
    const newValue = modalInteraction.fields.getTextInputValue('configValue');

    
    config[selectedKey] = newValue;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

    await modalInteraction.reply({ content: `✅ \`${selectedKey}\` başarıyla güncellendi: \`${newValue}\``, ephemeral: true });
  });
};
