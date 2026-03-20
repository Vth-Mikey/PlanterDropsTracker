require('dotenv').config(); // 🔐 This MUST be at the very top
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const TOKEN = process.env.BOT_TOKEN; // 🛡️ Securely pulls from the .env file
const LOG_FILE = path.join(__dirname, 'logs.json');

// --- 🎨 EMOJI MAP ---
const EMOJI_MAP = {
    "BotLogo": "<:logbook:1484213039787151390>",
    "Plastic Planter": "<:plastic:1484192616936374282>",
    "Candy Planter": "<:candyplant:1484192697873989833>",
    "Red Clay Planter": "<:redclay:1484192741989679255>",
    "Blue Clay Planter": "<:blueclay:1484192788747911309>",
    "Tacky Planter": "<:tacky:1484192841390362787>",
    "Pesticide Planter": "<:pesticide:1484192889197297865>",
    "Heat-Treated Planter": "<:heat:1484192970038313232>",
    "Hydroponic Planter": "<:hydro:1484193041211461674>",
    "Petal Planter": "<:petal:1484193079333228574>",
    "Planter of Plenty": "<:plenty:1484193122136228064>",
    "Swirled Wax": "<:swirled:1484194466364653629>",
    "Caustic Wax": "<:caustic:1484194505208107068>",
    "Super Smoothie": "<:supersmoothie:1484194542201606296>",
    "Glues": "<:glue:1484194589945499689>",
    "Stingers": "<:sting:1484194632018432182>",
    "Micro-Converter": "<:micro:1484194671826833549>",
    "Loaded Dice": "<:loaded:1484194714247893142>",
    "Neonberries": "<:neon:1484194744635621456>",
    "Red Extracts": "<:redex:1484194775145119854>",
    "Blue Extracts": "<:blueex:1484194837560299741>",
    "Enzymes": "<:enzymes:1484194884666789979>",
    "Oils": "<:oiloil:1484194940450771244>",
    "Bitterberries": "<:bitterb:1484222904613732555>",
    "Sunflower": "<:sunflo:1484196323426308237>",
    "Dandelion": "<:dandelion:1484196363133648926>",
    "Mushroom": "<:mush:1484196382461132891>",
    "Blue Flower": "<:blueflower:1484196398474989608>",
    "Clover": "<:clover:1484196413259907273>",
    "Bamboo": "<:bamb:1484196459997036614>",
    "Spider": "<:spi:1484196446482993153>",
    "Strawberry": "<:straw:1484196429986795763>",
    "Cactus": "<:cac:1484196521296531647>",
    "Pumpkin Patch": "<:pumpkin:1484196535955619930>",
    "Pineapple Patch": "<:papple:1484196489637920828>",
    "Stump": "<:stump:1484196505630802061>",
    "Rose": "<:rosy:1484196563835162697>",
    "Pine Forest": "<:pine:1484196549243310160>",
    "Mountain Top": "<:mount:1484196579052097756>",
    "Coconut": "<:buko:1484196610488664194>",
    "Pepper Patch": "<:pepper:1484196594004791472>"
};

// --- MASTER DATABASE ---
const planterData = {
    "Plastic Planter": [
        {id:"plas_wax",label:"1x Swirled Wax",cd:36,field:"Coconut",type:"1x Plant", dropKey:"Swirled Wax"},
        {id:"plas_caus",label:"1x Caustic Wax",cd:36,field:"Rose",type:"1x Plant", dropKey:"Caustic Wax"},
        {id:"plas_smooth",label:"1x Super Smoothie",cd:36,field:"Any Field",type:"1x Plant", dropKey:"Super Smoothie"}
    ],
    "Candy Planter": [
        {id:"can_wax",label:"1x Swirled Wax",cd:36,field:"Cactus",type:"1x Plant", dropKey:"Swirled Wax"},
        {id:"can_caus",label:"1x Caustic Wax",cd:36,field:"Mountain Top",type:"1x Plant", dropKey:"Caustic Wax"},
        {id:"can_glue",label:"10x Glues",cd:7,field:"Stump",type:"3x (Fully Grown)", dropKey:"Glues"}
    ],
    "Red Clay Planter": [
        {id:"red_wax_m",label:"1x Swirled Wax (Monthly)",cd:36,field:"Sunflower",type:"1x Plant", dropKey:"Swirled Wax"},
        {id:"red_caus",label:"1x Caustic Wax",cd:36,field:"Clover",type:"1x Plant", dropKey:"Caustic Wax"},
        {id:"red_wax_w",label:"1x Swirled Wax (Weekly)",cd:7,field:"Pine Forest",type:"1x Plant", dropKey:"Swirled Wax"},
        {id:"red_sting",label:"10x Stingers",cd:14,field:"Clover -> Spider -> Cactus",type:"Sequence", dropKey:"Stingers"}
    ],
    "Blue Clay Planter": [
        {id:"blue_micro",label:"10-15x Micro-Converters",cd:36,field:"Spider",type:"1x Plant", dropKey:"Micro-Converter"},
        {id:"blue_wax",label:"1x Swirled Wax",cd:36,field:"Spider",type:"1x Plant", dropKey:"Swirled Wax"},
        {id:"blue_caus",label:"1x Caustic Wax",cd:36,field:"Clover",type:"1x Plant", dropKey:"Caustic Wax"}
    ],
    "Tacky Planter": [
        {id:"tack_wax",label:"1x Swirled Wax",cd:36,field:"Pumpkin Patch",type:"1x Plant", dropKey:"Swirled Wax"},
        {id:"tack_caus",label:"1x Caustic Wax",cd:36,field:"Bamboo",type:"1x Plant", dropKey:"Caustic Wax"},
        {id:"tack_dice",label:"1x Loaded Dice",cd:36,field:"Mountain Top",type:"1x Plant", dropKey:"Loaded Dice"}
    ],
    "Pesticide Planter": [
        {id:"pest_bitter",label:"100x Bitterberries",cd:36,field:"Strawberry",type:"1x Plant", dropKey:"Bitterberries"},
        {id:"pest_wax",label:"1x Swirled Wax",cd:36,field:"Strawberry",type:"1x Plant", dropKey:"Swirled Wax"},
        {id:"pest_neon",label:"25+ Neonberries",cd:7,field:"Stump -> Mountain Top -> Coconut",type:"Sequence", dropKey:"Neonberries"}
    ],
    "Heat-Treated Planter": [
        {id:"heat_dice",label:"1x Loaded Dice (Daily)",cd:1,field:"Mushroom",type:"1x Plant", dropKey:"Loaded Dice"},
        {id:"heat_red",label:"100x Red Extracts",cd:36,field:"Mushroom -> Strawberry -> Rose -> Pepper Patch",type:"Sequence", dropKey:"Red Extracts"},
        {id:"heat_enz",label:"100x Enzymes",cd:36,field:"Pineapple Patch",type:"3x (In a row)", dropKey:"Enzymes"},
        {id:"heat_wax",label:"1x Swirled Wax",cd:36,field:"Blue Flower",type:"1x Plant", dropKey:"Swirled Wax"},
        {id:"heat_caus",label:"1x Caustic Wax",cd:36,field:"Coconut",type:"1x Plant", dropKey:"Caustic Wax"}
    ],
    "Hydroponic Planter": [
        {id:"hyd_dice",label:"1x Loaded Dice (Daily)",cd:1,field:"Blue Flower",type:"1x Plant", dropKey:"Loaded Dice"},
        {id:"hyd_blue",label:"100x Blue Extracts",cd:36,field:"Blue Flower -> Bamboo -> Pine Forest -> Stump",type:"Sequence", dropKey:"Blue Extracts"},
        {id:"hyd_oil",label:"100x Oils",cd:36,field:"Sunflower",type:"3x (In a row)", dropKey:"Oils"},
        {id:"hyd_wax",label:"1x Swirled Wax",cd:36,field:"Mushroom",type:"1x Plant", dropKey:"Swirled Wax"},
        {id:"hyd_caus",label:"1x Caustic Wax",cd:36,field:"Coconut",type:"1x Plant", dropKey:"Caustic Wax"}
    ],
    "Petal Planter": [
        {id:"pet_wax",label:"1x Swirled Wax",cd:36,field:"Strawberry",type:"1x Plant", dropKey:"Swirled Wax"},
        {id:"pet_caus",label:"1x Caustic Wax",cd:36,field:"Dandelion",type:"1x Plant", dropKey:"Caustic Wax"}
    ],
    "Planter of Plenty": [
        {id:"plen_smooth",label:"10x Super Smoothies",cd:36,field:"Bamboo",type:"1x Plant", dropKey:"Super Smoothie"},
        {id:"plen_wax",label:"5x Swirled Wax",cd:36,field:"Any Field",type:"1x Plant", dropKey:"Swirled Wax"}
    ]
};

// --- DATA LOGIC ---
function formatField(str) { let result = str; Object.keys(EMOJI_MAP).forEach(key => { if(str.includes(key)) result = result.replace(key, `${EMOJI_MAP[key]} ${key}`); }); return result; }
function loadLogs(){ if(!fs.existsSync(LOG_FILE)) return {}; try { return JSON.parse(fs.readFileSync(LOG_FILE,'utf8')); } catch(e){ return {}; } }
function saveLog(u,d,c,chan){ const l=loadLogs(); if(!l[u]) l[u]={}; const now = Date.now(); const end = new Date(); end.setDate(end.getDate()+c); l[u][d]={ startTime: now, time: end.getTime(), channelId: chan, notified: false }; fs.writeFileSync(LOG_FILE,JSON.stringify(l,null,2)); }
function getStatus(u,d){ const l=loadLogs(); if(!l[u]||!l[u][d]) return {type:"untracked",text:"Untracked"}; const n=Date.now(), t=l[u][d].time, s=l[u][d].startTime || n; const unixSeconds = Math.floor(t / 1000); const discordTime = `<t:${unixSeconds}:R>`; if(n>=t) return {type:"ready",text:"Ready!", percent: 1}; const total = t - s; const elapsed = n - s; const percent = Math.min(Math.max(elapsed / total, 0), 1); return {type:"active", text: discordTime, percent: percent}; }
function createBar(percent) { const size = 10; const filled = Math.round(percent * size); return `\`${"🟩".repeat(filled)}${"⬛".repeat(size - filled)}\` ${Math.round(percent * 100)}%`; }

// --- UI COMPONENTS ---
function getMainMenu() {
    const embed = new EmbedBuilder()
        .setTitle(`${EMOJI_MAP["BotLogo"]} Planter Tracker`)
        .setDescription('"Harvest -> Track -> Wait -> Repeat"\n\nSelect a planter to start tracking, or check the Book Manual.')
        .setColor('#f1c40f');
    const menu = new StringSelectMenuBuilder().setCustomId('sel_p').setPlaceholder('Choose a Planter...').addOptions(Object.keys(planterData).map(n=>{
        const eId = EMOJI_MAP[n]?.match(/\d+/)?.[0]; return {label:n, value:n, emoji: eId};
    }));
    const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('sum').setLabel('Summary').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('guide').setLabel('Book Manual').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('res').setLabel('Reset All').setStyle(ButtonStyle.Danger)
    );
    return { embeds: [embed], components: [new ActionRowBuilder().addComponents(menu), buttons] };
}

async function checkReminders() {
    const logs = loadLogs(); const now = Date.now(); let updated = false;
    for (const userId in logs) {
        for (const dropId in logs[userId]) {
            const entry = logs[userId][dropId];
            if (now >= entry.time && !entry.notified) {
                try {
                    const channel = await client.channels.fetch(entry.channelId);
                    if (channel) {
                        let pName, dLabel, dField, dDrop;
                        for(const p in planterData) { const found = planterData[p].find(x => x.id === dropId); if(found) { pName = p; dLabel = found.label; dField = found.field; dDrop = found.dropKey; break; } }
                        const pEmoji = EMOJI_MAP[pName] || "🐝"; const dEmoji = EMOJI_MAP[dDrop] || "";
                        await channel.send(`🔔 <@${userId}>, ${dEmoji} **${dLabel}** in **${dField}** from ${pEmoji} **${pName}** is refreshed!`);
                        logs[userId][dropId].notified = true; updated = true;
                    }
                } catch (e) { console.error("Reminder failed:", e); }
            }
        }
    }
    if (updated) fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

client.once('ready', () => { console.log(`✅ Online: ${client.user.tag}`); setInterval(checkReminders, 60000); });

client.on('interactionCreate', async (i) => {
    const u = i.user.id;

    // --- 1. HANDLE SLASH COMMANDS ---
    if (i.isChatInputCommand()) {
        if (i.commandName === 'logbook') {
            return await i.reply(getMainMenu());
        }

        if (i.commandName === 'backup') {
            try {
                if (!fs.existsSync(LOG_FILE)) {
                    return i.reply({ content: "❌ No logs found yet! Start tracking a planter first.", ephemeral: true });
                }
                const attachment = new AttachmentBuilder(LOG_FILE);
                await i.user.send({ content: "📦 **Planter Logbook Backup**\nKeep this file safe!", files: [attachment] });
                return i.reply({ content: "✅ Check your DMs! I've sent you the `logs.json` file.", ephemeral: true });
            } catch (error) {
                console.error(error);
                return i.reply({ content: "❌ I couldn't DM you! Please make sure your DMs are open for this server.", ephemeral: true });
            }
        }
    }

    // --- 2. HANDLE BUTTONS & MENUS ---
    try {
        // ... the rest of your button/menu code starts here ...

        if (i.isButton() && i.customId === 'back_to_main') {
            await i.deferUpdate(); await i.editReply(getMainMenu());
        }

        if (i.isButton() && i.customId === 'guide') {
            if(!i.deferred && !i.replied) await i.deferReply({ flags: [64] });
            const guideEmbed = new EmbedBuilder()
                .setTitle('📖 Book Manual: Planter Mechanics').setDescription('Reference guide for your tracking journey:')
                .addFields(
                    { name: '📍 1x Plant', value: 'Guaranteed reward after a single full harvest in the listed field.' },
                    { name: '📍 3x (In a row/Fully Grown)', value: 'Requires a number of planter harvest to unlock the drop' },
                    { name: '📍 Sequence', value: 'Follow the specific order of fields to claim the drop.' },
                    { name: '⏳ Reminders', value: 'The bot will ping you automatically when the cooldown of drops refreshed!' }
                ).setColor('#3498db');
            await i.editReply({ embeds: [guideEmbed] });
        }

        if (i.isStringSelectMenu() && i.customId === 'sel_p') {
            await i.deferUpdate();
            const p = i.values[0], d = planterData[p], pEmoji = EMOJI_MAP[p] || "";
            const menu = new StringSelectMenuBuilder().setCustomId(`log_${p}`).setPlaceholder('Select the drop...').addOptions(d.map(x => {
                const eId = EMOJI_MAP[x.dropKey]?.match(/\d+/)?.[0]; return { label: x.label, description: `Field: ${x.field}`, value: x.id, emoji: eId };
            }));
            const backBtn = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('back_to_main').setLabel('⬅️ Back to Planters').setStyle(ButtonStyle.Secondary));
            await i.editReply({ embeds: [new EmbedBuilder().setTitle(`${pEmoji} ${p} Information`).setDescription('Choose the drop you are farming:').setColor('#3498db')], components: [new ActionRowBuilder().addComponents(menu), backBtn] });
        }
        
        if (i.isStringSelectMenu() && i.customId.startsWith('log_')) {
            if(!i.deferred && !i.replied) await i.deferReply({ flags: [64] });
            const p = i.customId.replace('log_',''), dId = i.values[0], info = planterData[p].find(x=>x.id===dId), status = getStatus(u, dId);
            if (status.type === "active") return i.editReply({ content: `⚠️ **Already Tracking!** Cooldown ends: ${status.text}`, embeds: [], components: [] });
            saveLog(u, dId, info.cd, i.channelId); 
            await i.editReply({ embeds: [new EmbedBuilder().setTitle("✅ Planter Tracked").setDescription(`**Planter:** ${EMOJI_MAP[p]} ${p}\n**Drop:** ${EMOJI_MAP[info.dropKey]} ${info.label}\n**Field:** ${formatField(info.field)}\n**Type:** ${info.type}`).setColor('#2ecc71')], components: [] });
        }

        if (i.isButton() && i.customId === 'sum') {
            if(!i.deferred && !i.replied) await i.deferReply({ flags: [64] });
            let txt = ""; let activeDrops = [];
            Object.keys(planterData).forEach(pn => { 
                planterData[pn].forEach(dr => { 
                    const s = getStatus(u, dr.id); 
                    if(s.type === "active") { 
                        txt += `${EMOJI_MAP[pn]} **${pn}** - ${EMOJI_MAP[dr.dropKey]} ${dr.label}\n(Field: ${formatField(dr.field)}, Type: ${dr.type})\n${createBar(s.percent)}\n⏳ Ready: ${s.text}\n\n`;
                        activeDrops.push({ label: dr.label, value: dr.id, description: pn });
                    }
                })
            });
            const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('back_to_main').setLabel('⬅️ Back').setStyle(ButtonStyle.Secondary));
            if (activeDrops.length > 0) row.addComponents(new ButtonBuilder().setCustomId('rem_drop_menu').setLabel('🗑️ Remove a Tracker').setStyle(ButtonStyle.Danger));
            await i.editReply({ embeds: [new EmbedBuilder().setTitle('📊 Active Drops Trackers').setDescription(txt || "No active trackers!").setColor('#9b59b6')], components: [row] });
        }

        // --- SELECTIVE REMOVAL INTERACTION ---
        if (i.isButton() && i.customId === 'rem_drop_menu') {
            await i.deferUpdate();
            let activeDrops = [];
            Object.keys(planterData).forEach(pn => { 
                planterData[pn].forEach(dr => { if(getStatus(u, dr.id).type === "active") activeDrops.push({ label: dr.label, value: dr.id, description: pn }); });
            });
            const menu = new StringSelectMenuBuilder().setCustomId('delete_drop').setPlaceholder('Select a tracker to remove...').addOptions(activeDrops.slice(0, 25));
            await i.editReply({ components: [new ActionRowBuilder().addComponents(menu), new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('back_to_main').setLabel('⬅️ Back').setStyle(ButtonStyle.Secondary))] });
        }

        if (i.isStringSelectMenu() && i.customId === 'delete_drop') {
            await i.deferUpdate();
            const l = loadLogs(); if (l[u]) delete l[u][i.values[0]];
            fs.writeFileSync(LOG_FILE, JSON.stringify(l, null, 2));
            await i.editReply({ content: "✅ Tracker removed successfully.", embeds: [], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('back_to_main').setLabel('🏠 Home').setStyle(ButtonStyle.Primary))] });
        }

        if (i.isButton() && i.customId === 'res') {
            if(!i.deferred && !i.replied) await i.deferReply({ flags: [64] });
            const l = loadLogs(); delete l[u]; fs.writeFileSync(LOG_FILE, JSON.stringify(l,null,2));
            await i.editReply({ content: "🗑️ All logs cleared.", embeds: [], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('back_to_main').setLabel('🏠 Home').setStyle(ButtonStyle.Primary))] });
        }
    } catch (e) { console.error("Interaction Error:", e); }
});

client.login(TOKEN);
