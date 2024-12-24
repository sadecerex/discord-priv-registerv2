const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');
const { token, Aktivite, AktiviteURL, prefix, kayitsiz, mongodb, ucube } = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,  
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.on('ready', () => {
  console.log(`${client.user.tag} olarak giriş yapıldı!`);

  client.user.setPresence({
    activities: [{
      name: Aktivite,
      type: ActivityType.Streaming,
      url: AktiviteURL
    }],
    status: 'dnd',
  });
});

mongoose.connect(mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB\'ye başarıyla bağlanıldı.');
}).catch((error) => {
  console.error('MongoDB bağlantı hatası:', error);
});


client.commands = new Map();


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}


client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
      await command.execute(message, args);
  } catch (error) {
      console.error(error);
      message.reply('Komut çalıştırılırken bir hata oluştu.');
  }
});

client.on('guildMemberAdd', async (member) => {
  const unregRole = member.guild.roles.cache.find(kayitsiz);
  if (!unregRole) {
      console.error('Unregrole rolü bulunamadı. Rol ismini kontrol edin.');
      return;
  }
  try {
      await member.roles.add(unregRole);
      console.log(`${member.user.tag} adlı kullanıcıya 'unregrole' rolü verildi.`);
  } catch (error) {
      console.error('Rol verilirken bir hata oluştu:', error);
  }
});

client.on('guildAuditLogEntryCreate', async (auditLog) => {
  const logChannel = client.channels.cache.get(denetimlog);
  if (!logChannel) {
      console.error('Log kanalı bulunamadı. Kanal kimliğini kontrol edin.');
      return;
  }

  const { action, executor, target, createdAt, reason } = auditLog;

  const logEmbed = new EmbedBuilder()
      .setColor(0xffa500)
      .setTitle('Denetim Kaydı Olayı')
      .addFields(
          { name: 'Eylem', value: action || 'Bilinmiyor', inline: true },
          { name: 'Yapan', value: executor.tag || 'Bilinmiyor', inline: true },
          { name: 'Hedef', value: target?.tag || 'Bilinmiyor', inline: true },
          { name: 'Sebep', value: reason || 'Belirtilmemiş', inline: true }
      )
      .setTimestamp(createdAt)
      .setFooter({ text: `${executor.username} tarafından gerçekleştirildi.` });

  logChannel.send({ embeds: [logEmbed] });
});

client.on('guildBanRemove', async (ban) => {
  const isBanned = await BanList.findOne({ userId: ban.user.id });
  if (isBanned) {
      try {
          await ban.guild.members.ban(ban.user.id, { reason: 'Yasaklı listesinde.' });
          console.log(`${ban.user.tag} tekrar yasaklandı.`);
      } catch (error) {
          console.error(`Kullanıcı yeniden yasaklanamadı: ${ban.user.tag}`, error);
      }
  }
});
client.on('guildMemberAdd', async (member) => {
  const isUcube = await UcubeList.findOne({ userId: member.user.id });
  if (isUcube) {
      const ucubeRole = member.guild.roles.cache.get(ucube);
      if (ucubeRole) {
          await member.roles.add(ucubeRole);
          console.log(`${member.user.tag} sunucuya yeniden katıldı ve ucube rolü verildi.`);
      }
  }
});



client.login(token);
