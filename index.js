const Discord = require('discord.js');
var bot = new Discord.Client();
var prefix = ("!");
const YTDL = require("ytdl-core");
bot.login(process.env.TOKEN);

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

var servers = {};

bot.on("ready", function() {
    bot.user.setActivity("!help | V.5.0")
    console.log("Connecté");
});


bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(prefix)) return;

    var args = message.content.substring(prefix.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "play":
            if (!args[1]) {
                message.channel.sendMessage("Merci d'envoyer le lien.");
                return;
            }

            if (!message.member.voiceChannel) {
                message.channel.sendMessage("Tu dois être dans un channel vocal.");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message);
            });
            break;
        case "skip":
            var server = servers[message.guild.id];

            if (server.dispatcher) server.dispatcher.end();
            break;
        case "stop":
            var server = servers[message.guild.id];

            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            break;
        case "helpmod":
            let modRole = message.guild.roles.find("name", "Modérateurs");
            if(message.member.roles.has(modRole.id)) {
                var embed = new Discord.RichEmbed()
                .setTitle("Modération")
                .setDescription("Commande Modérateur")
                .addField(".ban", "Bannir un utilisateur.", true)
                .addField(".kick", "Expulser un utilisateur.", true)      
                .setColor("0xFF8000")
            message.author.sendEmbed(embed)
            message.react("✉")
            message.reply("La liste des commandes vous a été envoyé en message privée. :envelope:")
            }else{
                return message.reply("Tu n'as pas la permission de faire cette commande.")}
            break;
        case "helpadmin":
            if(!message.member.hasPermission("ADMINISTRATOR")) {
                return message.reply("Tu n'as pas la permission")
            }else{
                var embed = new Discord.RichEmbed()
                .setTitle("Administration")
                .setDescription("Commande Administrateur")
                .addField(".say", "Faire parler le bot", true)
                .addField(".sondage", "créer un sondage", true)      
                .setColor("0xFF0000")
            message.author.sendEmbed(embed)
            message.react("✉")
            message.reply("La liste des commandes ADMIN vous a été envoyé en message privée. :envelope:")}
            break;
        case "yt":
            var embed = new Discord.RichEmbed()
            .setTitle("YouTube")
            .setDescription("Chaîne Codage:")
            .addField("PZH", "[Cliquez ici](https://www.youtube.com/c/pzhcodage)", true)       
            .setColor("0xFF0000")
            .setFooter("PZH est un YouTubeur qui code des bots discord.")
            .setTimestamp()
        message.channel.sendEmbed(embed)
            break;
        case "info":
            var embed = new Discord.RichEmbed()
                .setTitle("INFO")
                .setDescription("Information du bot")
                .addField("Création", "Le 10/01/2018 à 17h17", true)
                .addField("Créateur", "Crée par [PZH](https://www.youtube.com/c/pzhcodage)", true)
                .addField("Version du bot", "Version 5.0", true)
                .addField("Dernière mise à jour:", "Le 28/03/2018 à 18:39", true)
                .addField("à savoir", "Si vous cliquez sur [PZH](https://www.youtube.com/c/pzhcodage), cela vous redirigera sur sa chaîne YouTube", true)
                .setColor("0xE74C3C")
                .addField("Apprend à coder un bot discord !", "Suivez les tuto de [PZH](https://www.youtube.com/c/pzhcodage) sur sa chaîne youtube !", true)
                .setFooter("Toute ressemblance avec un autre bot serait qu'une pure coïncidence. Bon moment parmis la PZH's Community")
                .setTimestamp()
            message.channel.sendEmbed(embed);
            break;
        case "help":
            var embed = new Discord.RichEmbed()
            .setDescription("Help Menu")
            .addField("Utilitaire", "``!serverinfo \n !yt \n !avatar \n !musique \n !notification on \n !notification off``")
            .addField("Divertissement", "``!roll \n !8ball``")
            .addField("Musique", "``!play \n !skip \n !stop``")  
            .addField("Modération", "``!ban \n !kick \n !mute \n !purge \n !helpmod``")
            .addField("Administration", "``!sondage \n !say \n !helpadmin``")
            .setColor("0x00BFFF")
        message.author.sendEmbed(embed)
        message.react("✉")
        message.reply("La liste des commandes vous a été envoyé en message privée. :envelope:")
            break;
        case "say":
            let modRoleee = message.guild.roles.find("name", "Admins");
            if(message.member.roles.has(modRoleee.id)) {
            message.delete();
            let argse = message.content.split(" ").slice(1);
            let thingToEcho = argse.join(" ")
            message.channel.sendMessage(thingToEcho)
        }else{
            message.reply(`tu n'as pas la permission de faire cette commande.`)}
            break;
        case "sondage":
            if(message.member.hasPermission("ADMINISTRATOR")) {
                let argsee = message.content.split(" ").slice(1);
                let thingToEcho = argsee.join(" ")
                var embed = new Discord.RichEmbed()
                    .setDescription("Sondage")
                    .addField(thingToEcho, "Répondre avec :white_check_mark: ou :x:")
                    .setColor("0xB40404")
                    .setTimestamp()
            message.guild.channels.find("name", "sondage").sendEmbed(embed)
            .then(function (message) {
                message.react("✅")
                message.react("❌")
            }).catch(function() {
            });
            }else{
                return message.reply("Tu n'as pas la permission.")}
            break;
        case "musique":
            var embedsix = new Discord.RichEmbed()
                .setTitle("Musique [ Nouveau ]")
                .setDescription("Commande musique:")
                .addField(".play", "Ecouter une musique YouTube | Vous pouvez ajouter plusieurs musique avec le .play afin de créer un playlist", true)
                .addField(".skip", "Passer à la musique suivante", true)
                .addField(".stop", "Arrêter la musique", true)             
                .setColor("0xDF01D7")
                .setFooter("Les recherches ne sont pas prit en compte ( exemple:.play Musique 2018 ) Seulement les liens ! ( ex: https://www.youtube.com/watch?v=ooooo")
                .setTimestamp()
            message.channel.sendEmbed(embedsix)
            break;
        case "serverinfo":
            var embed = new Discord.RichEmbed()
                .setDescription("Information du Discord")
                .addField("Nom du Discord", message.guild.name)
                .addField("Crée le", message.guild.createdAt)
                .addField("Tu as rejoin le", message.member.joinedAt)
                .addField("Utilisateurs sur le discord", message.guild.memberCount)
                .addField("Test", `${channel.id}`)
                .setColor("0x0000FF")
            message.channel.sendEmbed(embed)
            break;
        case "newvideo":
            if(message.author.id == "330762245921439754"){
                let argseee = message.content.split(" ").slice(1);
                let thingToEcho = argseee.join(" ")
                var embed = new Discord.RichEmbed()
                    .setDescription("News")
                    .addField("Nouvelle vidéo de PZH", thingToEcho)
                    .setColor("0xB40404")
                    .setTimestamp()
            message.guild.channels.find("name", "news").sendEmbed(embed)
            .then(function (message) {
                message.react("✅")
                message.react("❌")
            }).catch(function() {
            });
            }else{
                return message.reply("Tu n'as pas la permission.")}
            break;
        case "kick":
            let command = message.content.split(" ")[0];
            const argseeeee = message.content.slice(prefix.length).split(/ +/);
            command = argseeeee.shift().toLowerCase();
    
            if (command === "kick") {
                let modRole = message.guild.roles.find("name", "Modérateurs");
                if(!message.member.roles.has(modRole.id)) {
                    return message.reply("Tu n'as pas la permission de faire cette commande.").catch(console.error);
                }
                if(message.mentions.users.size === 0) {
                    return message.reply("Merci de mentionner l'utilisateur à expluser.").catch(console.error);
                }
                let kickMember = message.guild.member(message.mentions.users.first());
                if(!kickMember) {
                    return message.reply("Cet utilisateur est introuvable ou impossible à expulser.")
                }
                if(!message.guild.member(bot.user).hasPermission("KICK_MEMBERS")) {
                    return message.reply("Je n'ai pas la permission KICK_MEMBERS pour faire ceci.").catch(console.error);
                }
                kickMember.kick().then(member => {
                    message.reply(`${member.user.username} a été expulsé avec succès.`).catch(console.error);
                }).catch(console.error)}
            break;
        case "ban":
        let commande = message.content.split(" ")[0];
        const argseeeeee = message.content.slice(prefix.length).split(/ +/);
        commande = argseeeeee.shift().toLowerCase();
            if (commande === "ban") {
                let modRole = message.guild.roles.find("name", "Modérateurs");
                if(!message.member.roles.has(modRole.id)) {
                    return message.reply("Tu n'as pas la permission de faire cette commande.").catch(console.error);
                }
                const member = message.mentions.members.first();
                if (!member) return message.reply("Merci de mentionner l'utilisateur à bannir.");
                member.ban().then(member => {
                    message.reply(`${member.user.username} a été banni avec succès.`).catch(console.error);
                }).catch(console.error)}
            break;
        case "roll":
            var roll = Math.floor(Math.random() * args[1]) +1;
            if (!roll) return message.reply("Entre un numéro.")
            message.channel.send("Je choisis le numéro " + roll + " !");
            break;
        case "8ball":
        let argsed = message.content.split(" ").slice(1);
        let tte = argsed.join(" ")
        if (!tte){
            return message.reply("Merci de poser une question. :8ball:")};

                var replys = [
                "Oui.",
                "Non.",
                "Je ne sais pas.",
                "Peut-être.",
                "Probablement."
                ];
            
            let reponse = (replys[Math.floor(Math.random() * replys.length)])
            var ballembed = new Discord.RichEmbed()
            .setDescription(":8ball: 8ball")
            .addField("Question", tte)
            .addField("Réponse", reponse)
            .setColor("0x40FF00")
        message.channel.sendEmbed(ballembed)
            break;
            
       
    
    }
});


bot.on("guildMemberAdd", member => {
    var embed = new Discord.RichEmbed()
        .setImage(`${member.user.avatarURL}`)
        .setDescription("Activités")
        .addField("Arrivée", `> [${member.user.tag}](https://discord.gg/K8v3cpU) <`)
        .addField("Bienvenue parmis la PZH's Community", "Si tu as des questions, n'hésite pas")
        .addField(`Nombre d'utilisateurs sur le discord après l'arrivée de ${member.user.tag}`, member.guild.memberCount)
        .setColor("0xACF938")
    member.guild.channels.find("name", "welcome").sendEmbed(embed)
    member.guild.channels.find("name", "general").sendMessage(`Bienvenue ${member} !\nN'oublie pas de consulter le <#405705028783964170>`)
})

bot.on("guildMemberRemove", member =>{
    var embed = new Discord.RichEmbed()
        .setDescription("Activités")
        .addField("Départ", `> [${member.user.tag}](https://discord.gg/K8v3cpU) <`)
        .addField("Au revoir...", "Nous espérons vous revoir bientôt.")
        .addField(`Nombre d'utilisateurs sur le discord après le départ de ${member.user.tag}`, member.guild.memberCount)
        .setColor("0xFD6464")
    member.guild.channels.find("name", "welcome").sendEmbed(embed)
    
})

bot.on('guildMemberAdd', member => {
    var role = member.guild.roles.find('name', 'Membres');
    member.addRole(role)
})

bot.on('message', message => {

    if (message.content === prefix + "notification on") {
            var role = message.guild.roles.find('name', 'Notification');
                message.member.addRole(role)
                var embedon = new Discord.RichEmbed()
                    .setDescription("Notification")
                    .addField("Succès ! Vous avez bien activé vos notifications.", "Vous pouvez à tout instant désactiver les notifications avec la commande [!notification off](https://discord.gg/DRuyt7Q )")
                    .setColor("0xD7DF01")
                message.channel.sendEmbed(embedon)
                var embednotiff = new Discord.RichEmbed()
                    .setDescription(`${message.author.tag} vient d'activer ses notifications`)
                    .setTimestamp()
                    .setColor("0xFFFF00")
                message.guild.channels.find("name", "infopzh").sendEmbed(embednotiff)
            if (!role) return message.reply("Une erreur est survenue ! Rôle non trouvé. Réssayer plus tard.")
    }
    if (message.content === prefix + "notification off") {
        var roledel = message.guild.roles.find('name', 'Notification');
                message.member.removeRole(roledel)
                var embedoff = new Discord.RichEmbed()
                    .setDescription("Notification")
                    .addField("Succès ! Vous avez bien désactivé vos notifications.", "Vous pouvez à tout instant réactiver les notifications avec la commande [!notification on](https://discord.gg/DRuyt7Q )")
                    .setColor("0xD7DF01")
                message.channel.sendEmbed(embedoff)
                var embednotif = new Discord.RichEmbed()
                    .setDescription(`${message.author.tag} vient de désactiver ses notifications`)
                    .setTimestamp()
                    .setColor("0xFFFF00")
                message.guild.channels.find("name", "infopzh").sendEmbed(embednotif)
                if (role) return message.reply("Une erreur est survenue ! Réssayer plus tard.")
    }})

bot.on("message", message => {

    if(message.content === prefix + "nsfw") {
        message.channel.send("Cet accès peut choquer ou toucher la sensibilité des plus jeunes \nVous êtes responsable de ce que vous allez voir.\nëtes vous sûr d'avoir accès au NSFW ?").then(mess => {
            mess.react('✅')
            mess.react('❌')
            const track = mess.createReactionCollector((r, u) => u.id === message.author.id)
            track.on('collect', r => {
                if (r.emoji.name === "✅") { 
                message.channel.bulkDelete(1)
                message.delete()
                    var role = message.guild.roles.find('name', '⚠️ NSFW');
                    message.member.addRole(role)
                    message.reply("Vous avez bien reçu l'accès au NSFW")}
                if (r.emoji.name === "❌") {
                    message.channel.bulkDelete(1)}
                    message.channel.send("Demande d'accès au NSFW annulée !")


                    
                }
            
        
    
)})}})


