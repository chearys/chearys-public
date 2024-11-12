import Settings from "../../config";
import { sendDebugmsg } from "../../utils/functions/debug";
import { request }from "../../../requestV2";
import axios from "axios";

register("command", (meow) => {
    const playerName = meow || Player.getName();
    fetchAndTrigger(playerName);
}).setName("kuudra");

register("chat", (player) => {
    if (!Settings.kuudraInfo || player == Player.getName()) return;
    fetchAndTrigger(player); 
}).setCriteria(/^Party Finder > (.+) joined the group! \(.*\)$/);

function fetchAndTrigger(playerName) {
    fetchshit(playerName).then(result => {
        if (result) {
            trigger(result);
        } else {
            sendDebugmsg("No result returned from the API.");
        }
    });
}

function trigger(c) {
  
    //sendDebugmsg(`Processing data for ${c.ign}`);

    const kuudraLevelMessage = new TextComponent(`&cKuudra level ${c.kuudraStats.kuudraLevel} &c(T5 comps &c${c.kuudraStats.t5Comp}&c)`)
        .setHoverValue(c.hoverableMessage.kuudraCompletions);
    
    const ragnarockMessage = new TextComponent(`${(c.hoverableMessage.ragnarock.name) || "Ragnarock Axe"}`)
        .setHoverValue((`${c.hoverableMessage.ragnarock.lore}`) || "No lore found");

    const HelmetMessage = new TextComponent(`${(c.hoverableMessage.terror.helmet.name) || "No Terror Helmet"}`)
        .setHoverValue((`${c.hoverableMessage.terror.helmet.lore}`) || "No lore found");

    const ChestplateMessage = new TextComponent(`${(c.hoverableMessage.terror.chestplate.name) || "No Terror Chestplate"}`)
        .setHoverValue((`${c.hoverableMessage.terror.chestplate.lore}`) || "No lore found");

    const LeggingsMessage = new TextComponent(`${(c.hoverableMessage.terror.leggings.name) || "No Terror Leggings"}`)
        .setHoverValue((`${c.hoverableMessage.terror.leggings.lore}`) || "No lore found");

    const BootsMessage = new TextComponent(`${(c.hoverableMessage.terror.boots.name) || "No Terror Boots"}`)
        .setHoverValue((`${c.hoverableMessage.terror.boots.lore}`) || "No lore found");

    const wardenMessage = new TextComponent(`${(c.hoverableMessage.wardenHelmet.name) || "No Warden Helmet"}`)
    .setHoverValue((`${c.hoverableMessage.wardenHelmet.lore}`) || "No lore found");

    const statsMessage = new TextComponent(`&c${c.kuudraStats.statsType} Level&f: ${c.kuudraStats.stats}`)
    .setHoverValue((`${c.hoverableMessage.stats.LLDOM}`) || "No lore found");

    const MPMessage = new TextComponent(`&cMana Pool Level&f: ${c.kuudraStats.MPlevel}`)
    .setHoverValue((`${c.hoverableMessage.stats.MP}`) || "No lore found");

    const kickMessage = new TextComponent(`\n&cRemove &4${c.ign} &cfrom the party`)
        .setClick("run_command", `/p kick ${derank(c.ign)}`);

    ChatLib.chat(`&4[chearys] &8[${c.level}&8] ${c.rank} ${c.ign}'s &cKuudra stats:`);
    ChatLib.chat("");  
    ChatLib.chat(kuudraLevelMessage);
    ChatLib.chat(`&cNether Stars: ${c.kuudraStats.stars}`);
    ChatLib.chat(statsMessage);
    ChatLib.chat(MPMessage);
    ChatLib.chat(`&cMagical Power&f: ${c.kuudraStats.MP}`);
    ChatLib.chat(`&cBank&f: ${c.kuudraStats.bank}`);
    ChatLib.chat(`&cGold collection&f: ${c.kuudraStats.goldCollection}`);
    ChatLib.chat("");  
    ChatLib.chat(ragnarockMessage);
    ChatLib.chat(`&dChimera &f${c.kuudraStats.chimLevel}`);
    ChatLib.chat("");
    ChatLib.chat(wardenMessage);
    ChatLib.chat(HelmetMessage);
    ChatLib.chat(ChestplateMessage);
    ChatLib.chat(LeggingsMessage);
    ChatLib.chat(BootsMessage);
    ChatLib.chat(kickMessage);
}


function fetchshit(ign) {
    if (!ign) {
        console.error('IGN is missing or undefined.');
        return;
    }

    return axios.get(`https://api.chearys.com/ct/kuudra?ign=${ign}`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Chattriggers)',
            'Content-Type': 'application/json; charset=UTF-8'
        }
    })
    .then(function(response) {
        return response.data;
    })
    .catch(function(error) {
        if (error.response) {
            console.error('Error details:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Request setup error:', error.message);
        }
        return null;
    });
}




