import Settings from '../../config'; 
import { sendDebugmsg } from "../../utils/functions/debug";
import { sleep } from '../../utils/functions/cooldown';
import { registerWhen } from '../../utils/functions/reg';

function joinParty(player) {
    
    sleep(250, () => {
        ChatLib.command("p join " + player);
    })
     
}

register("chat", (player) => {
    if(!Settings.autoJoin) return;

    const whitelist = Settings.whitelist.split(",").map(entry => entry.trim().toLowerCase());
    const blacklist = Settings.blacklist.split(",").map(entry => entry.trim().toLowerCase());
  
    let match = player.removeFormatting().match(/\] (\w+)/);
    if (!match || !match[1]) return;

    let ign = match[1].toLowerCase();
   
    //sendDebugmsg("autojoin triggered");

    if (blacklist.includes(ign)) return //sendDebugmsg("User in blacklist");

    if (Settings.enableWhitelist) {
        if (whitelist.includes(ign)) {
            //sendDebugmsg(`Joining ${match[1]}'s party!`);
            joinParty(ign);    
        } else {
            //sendDebugmsg(`${match[1]} not in whitelist`);
        }
        return;
    } 

    //sendDebugmsg(`Joining ${match[1]}'s party!`);
    joinParty(ign);
    return;
                
}).setCriteria("${*}&r${player} &r&ehas invited you to join${*}")



