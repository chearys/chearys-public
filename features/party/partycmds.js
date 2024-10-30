import Settings from '../../config';
import { sendDebugmsg } from '../../utils/functions/debug';
import { sleep } from '../../utils/functions/cooldown';
import { derank } from '../../utils/functions/derank';
import { registerWhen } from '../../utils/functions/reg';
import { numberToWord } from '../../utils/functions/ntt';
import { sendmsg } from '../../utils/functions/msg';
import Party from '../../../BloomCore/Party';

//variables
const cooldown = {
    cat: 1000,
    socialxp: 20000,
    dropper: 5000,
    dungeons_mm: 5000,
    dungeons_normal: 5000,
    kuudra_basic: 5000,
    kuudra_hot: 5000,
    kuudra_burning: 5000,
    kuudra_fiery: 5000,
    kuudra_infernal: 1000,
    inv: 3000,
    ping: 2000,
    credit: 2000,
    ily: 2000,
    tps: 2000,
    warp: 3000,
    sw: 5000,
    bsg: 5000,
    roll: 1500,
    pick: 2000,
    help: 1000,
    cute: 2000,
    cf: 2000,
    allinvite: 1000,
    transfer: 1000,
    nuke: 1000
};

let lastTimeUsed = {
    cat: 0,
    socialxp: 0,
    dropper: 0,
    dungeons_mm: 0,
    dungeons_normal: 0,
    kuudra_basic: 0,
    kuudra_hot: 0,
    kuudra_burning: 0,
    kuudra_fiery: 0,
    kuudra_infernal: 0,
    inv: 0,
    credit: 0,
    ily:0,
    ping: 0,
    tps: 0,
    warp: 0,
    sw: 0,
    bsg: 0,
    roll: 0,
    pick: 0,
    help: 0,
    cute: 0,
    cf: 0,
    allinvite: 0,
    transfer: 0,
    nuke:0
};
//

//
function isLeader() {
    // If in party
    if (Object.values(Party.members).length == 0 || Party.leader == null) {
        sendmsg("No party info, try running command again");
        sleep(100, () => {
            ChatLib.command("pl");
        });
        return false;
    }

    // If leader
    if (Party.leader !== Player.getName()) {
        sendmsg("You're not leader!");
        return false;
    }

    if (Party.leader === Player.getName()) return true;
    // Else return false
        return false;
   
}

const cmds = (command) => {
    ChatLib.command(command);
}


function randomPartyMember() {
    let members = Object.values(Party.members);
    if (members.length === 0 || Party.leader == null) return null; // if no members or no leader, return null

    // Fisher-Yates shuffle to shuffle the members array
    for (let i = members.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [members[i], members[j]] = [members[j], members[i]];
    }

    let selectedMember = members[Math.floor(Math.random() * members.length)];

    return selectedMember.removeFormatting();
}
//

const updateCooldown = (command) => {
    const cd = cooldown[command];
    const currentTime = Date.now();
    const lastUsed = lastTimeUsed[command];
    
    if (Settings.enablePartyCommands && currentTime - lastUsed >= cd) {
        lastTimeUsed[command] = currentTime; 
        return true;
    } else if (Settings.enablePartyCommands && currentTime - lastUsed < cd) {
        const remainingCooldown = cd - (currentTime - lastUsed); 
        sendmsg(`On cooldown (${remainingCooldown} ms)!`);
    }
    return false;
};

const blacklist = Settings.pcmds_blacklist.split(",").map(entry => entry.trim().toLowerCase());

// Function to execute a command
const executeCommand = (command, fn) => {
    if (updateCooldown(command)) {
        fn();
    }
};

function trigger (player, command) {
    if(updateCooldown(command)) {
        //sendDebugmsg(`"${command}" triggered by ${player}.`)
        return true;
    } else return false;
}

/**
 * Handler
 */

register('chat', (player, args) => {
    if(!Settings.enablePartyCommands) return;
  
    switch(args) {

        /**
         * General commands
         */
    
        case("cat"): {
            if(!trigger(player, "cat")) return;
                cmds(`pc hehe <3 UwU :3 Meow ^-^ nya~ ヽ(^◇^*)/ ('-')⊃━☆ﾟ.*･｡ﾟ <3 you are now my pet cat! ^-^ `);
                break;
        }
        case("help"): {
            if(!trigger(player, "help")) return;
                cmds(`pc chearys modules: .cat | .roll | .pick | .dropper | .bsg | .sw | .m/f[1-7] | .t1-t5 | .ping | .tps | .socialxp | .cute | .credit | .allinvite | .inv(ite) | .warp | .nuke`);
                break;
        }
        case("credit"): {
            if(!trigger(player, "credit")) return;
                cmds(`pc made by chearys (chearys.) and kwuromi made 1 mod! `);
                break;
        }
        case("ily"): {
            if(!trigger(player, "ily")) return;
                cmds(`pc kwuromi <3 chearys! thank you for making the mod! `);
                break;
        }
        case("roll"): {
            if(!trigger(player, "roll")) return;
                cmds(`pc ${derank(player)} rolled ${Math.floor(Math.random() * 100)}!`);
                break;
        }
        case("cute"): {
            if(!trigger(player, "cute")) return;
                cmds(`pc ${derank(player)} is ${Math.floor(Math.random() * 100)}% cute!`);
                break;
        }
        case("cf"): {
            if(!trigger(player, "cf")) return;
                cmds(`pc ${Math.random() < 0.5 ? "Heads!" : "Tails!"}`);
                break;
        }
        case("pick"): {
            if(!trigger(player, "pick")) return;
                if(!randomPartyMember()) {
                    cmds(`party list`);
                    sleep(500, () => {
                        cmds(`pc picked ${derank(randomPartyMember())}`);
                    });
                    return;
                }
                cmds(`pc picked ${derank(randomPartyMember())}`);
                break;
        }
        case("nuke"): {
            if(!trigger(player, "nuke")) return;
            if(isLeader()) {
                cmds(`party disband`);
                return;
            }
                cmds(`pc .ptme`);
                sleep(500, () => {
                cmds(`party disband`);
                });
                break;
        }
        
        /**
         * Requires leader
         */

        case("warp"): {
            if (!isLeader()) return;
            if(!trigger(player, "warp")) return;
                cmds(`party warp`);
                break;
        }

        /**
         * Join instance or play
         */

        case("dropper"): {
            if (!isLeader()) return;
            if(!trigger(player, "dropper")) return;
                cmds(`play arcade_dropper`);
                break;
       
        }
        case("bsg"): {
            if(!isLeader()) return;
            if(!trigger(player, "bsg")) return;
                cmds(`play blitz_solo_normal`);
                break;
        }
        case("sw"): {
            if(!isLeader()) return;
            if(!trigger(player, "sw")) return;
                cmds(`play solo_normal`);
                break;
        }

        /**
         * Regex match
         */


        default: {
            switch (true) {
                case /^(al|allinv|allinvite)$/.test(args): {
                    if (!isLeader()) return;
                    if (!trigger(player, "allinvite")) return;
                    cmds(`party settings allinvite`);
                    break;
                }
                case /^(ptme|transfer|pt|ptransfer)$/.test(args): {
                    if (!isLeader()) return;
                    if (!trigger(player, "transfer")) return;
                    if (blacklist.includes(derank(player).toLowerCase())) return //sendDebugmsg(`${player} is in blacklist`);
                    cmds(`party transfer ${derank(player)}`);
                    break;
                }
                case /^m[1-7]$/.test(args): {
                    if (!isLeader()) return;
                    const floor = args.match(/^m([1-7])$/)[1];
                    if(isNaN(floor) || floor < 1 || floor > 7) return;
                    if(!trigger(player, 'dungeons_mm')) return;
                        cmds(`joindungeon master_catacombs_floor_${numberToWord(parseInt(floor))}`);
                    break;
                }
                case /^f[1-7]$/.test(args): {
                    if (!isLeader()) return;
                    const floor = args.match(/^f([1-7])$/)[1]
                    if(isNaN(floor) || floor < 1 || floor > 7) return;
                    if(!trigger(player, 'dungeons_normal')) return;
                    cmds(`joindungeon catacombs_floor_${numberToWord(parseInt(floor))}`);
                    break;
                }
                case /^(t1|basic)$/.test(args): {
                    if (!isLeader()) return;
                    if(!trigger(player, 'kuudra_basic')) return;
                    cmds(`joininstance KUUDRA_NORMAL`);
                    break;
                }
                case /^(t2|hot)$/.test(args): {
                    if (!isLeader()) return;
                    if(!trigger(player, 'kuudra_hot')) return;
                    cmds(`joininstance KUUDRA_HOT`);
                    break;
                }
                case /^(t3|burning)$/.test(args): {
                    if (!isLeader()) return;
                    if(!trigger(player, 'kuudra_burning')) return;
                    cmds(`joininstance KUUDRA_BURNING`);
                    break;
                }
                case /^(t4|fiery)$/.test(args): {
                    if (!isLeader()) return;
                    if(!trigger(player, 'kuudra_fiery')) return;
                    cmds(`joininstance KUUDRA_FIERY`);
                    break;
                }
                case /^(t5|infernal|raider|looter)$/.test(args): {
                    if (!isLeader()) return;
                    if(!trigger(player, 'kuudra_infernal')) return;
                    cmds(`joininstance KUUDRA_INFERNAL`);
                    break;
                }
                
            }
        
    }

    
}
}).setCriteria("Party > ${player}: .${args}")

register('chat', (player, args) => {
    if(!Settings.enablePartyCommands) return;
    switch(args) {
        case("warp"): {
            if (!isLeader()) return;
            if(!trigger(player, "warp")) return;
                cmds(`party warp`);
                break;
        }
    }
}).setCriteria("Party > ${player}: !${args}")

/**
 * Not in party
 */

register('chat', (ignToInv) => {
    if(!Settings.enablePartyCommands) return;
    executeCommand('inv', () => {
        //sendDebugmsg(`inviting ${ignToInv}!`);
        cmds(`party invite ${ignToInv}`);
    });
}).setCriteria(/From (?:\[[^\]]+\] )?(\w+)(?: [ቾ⚒])?: ?\.(party|p|inv|invite)/)


/**
 * Ping and TPS
 */

const S37PacketStatistics = Java.type('net.minecraft.network.play.server.S37PacketStatistics');
const C16PacketClientStatus = Java.type('net.minecraft.network.play.client.C16PacketClientStatus');
const S03_PACKET_TIME_UPDATE = Java.type('net.minecraft.network.play.server.S03PacketTimeUpdate');
const System = Java.type('java.lang.System');

let lastPingAt = -1;
let requestedPing = false;
let requestedTPS = false;
let prevTime = null;

register('worldLoad', () => {
	prevTime = null;
})

register('chat', (player) => {
    if(!Settings.enablePartyCommands) return;
    executeCommand('ping', () => {
        //sendDebugmsg(`ping requested by ${player}`);
        Client.sendPacket(new C16PacketClientStatus(C16PacketClientStatus.EnumState.REQUEST_STATS));
	    lastPingAt = System.nanoTime();
	    requestedPing = true;
    });
}).setCriteria("Party > ${player}: .ping")

register('chat', (player) => {
    if(!Settings.enablePartyCommands) return;
    executeCommand('tps', () => {
        //sendDebugmsg(`tps requested by ${player}`);
        requestedTPS = true;
    });
}).setCriteria("Party > ${player}: .tps")


register('packetReceived', (packet) => {
	if (lastPingAt > 0 && requestedPing) {
		if (packet instanceof S37PacketStatistics) {
			let diff = Math.abs((System.nanoTime() - lastPingAt) / 1_000_000);
            //sendDebugmsg(`Ping: ${diff}`);
			ChatLib.command(`pc [chearys] Ping: ${parseInt(diff)}`);
			lastPingAt *= -1;
			requestedPing = false;
		}
	}

	if (packet instanceof S03_PACKET_TIME_UPDATE && requestedTPS) {
		if (prevTime !== null) {
			let time = Date.now() - prevTime;
			let instantTps = MathLib.clampFloat(20000 / time, 0, 20);
            //sendDebugmsg(`TPS: ${instantTps}`);
			ChatLib.command(`pc [chearys] TPS: ${parseFloat(instantTps).toFixed(1)}`);
			requestedTPS = false;
		}
		prevTime = Date.now();
	}
})

