import Settings from "../../config";
import { sleep } from "../../utils/functions/cooldown";
import { sendDebugmsg } from "../../utils/functions/debug";
import { formatTime } from "../../utils/functions/time";
import { formatTimeMs } from "../../utils/functions/time";
import { registerWhen } from "../../utils/functions/reg";
import Skyblock from "../../../BloomCore/Skyblock";
import splitgui from '../kuudra/splitgui';
import { data } from "../../utils/data/data";

let phase = 0;
let splits = [0, 0, 0, 0, 0, 0, 0, 0];
let times = [0, 0, 0, 0, 0, 0, 0];
let lines = {};
let overall = 0;
let splits6Set = false;
let freshCount = 0;
let scale = splitgui.KSscale;
let colors = [];


/**
 * In game time!
 */

let tickCount = 0;
let packetCount = 0;

let tickHandler, packetHandler;

function registerListener() {
    tickHandler = register("tick", () => {
        tickCount += 50;
    });
    packetHandler = register('packetReceived', () => {
        packetCount += 50;
    }).setFilteredClass(Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction"));
}

function unregisterListener() {
    if (packetHandler) {
        packetHandler.unregister();
        packetHandler = null;
    }
    if (tickHandler) {
        tickHandler.unregister();
        tickHandler = null;
    }
}

/**
 * Exports
 */
export function getPhase() {
    return phase;
}

export function getKillTime() {
    const lagCompensation = Math.max((packetCount - tickCount) / 20, 0);
    return (parseFloat(times[6]) + lagCompensation).toFixed(2);
}

function returnColor(input) {
    let color;
    switch (input) {
        case 0: color = "&0"; break;
        case 1: color = "&1"; break;
        case 2: color = "&2"; break;
        case 3: color = "&3"; break;
        case 4: color = "&4"; break;
        case 5: color = "&5"; break;
        case 6: color = "&6"; break;
        case 7: color = "&7"; break;
        case 8: color = "&8"; break;
        case 9: color = "&9"; break;
        case 10: color = "&a"; break;
        case 11: color = "&b"; break;
        case 12: color = "&c"; break;
        case 13: color = "&d"; break;
        case 14: color = "&e"; break;
        default: color = "&f"; break;
    }
    return color;
}

function resetColor() {
    colors[0] = `${returnColor(splitgui.supplyColor)}`;
    colors[1] = `${returnColor(splitgui.buildColor)}`;
    colors[2] = `${returnColor(splitgui.eatenColor)}`;
    colors[3] = `${returnColor(splitgui.stunColor)}`;
    colors[4] = `${returnColor(splitgui.DPSColor)}`;
    colors[5] = `${returnColor(splitgui.skipColor)}`;
    colors[6] = `${returnColor(splitgui.P4Color)}`;
    colors[7] = `${returnColor(splitgui.overallColor)}`;
}

function getColorCode(time, arrayIndex) {
    if (!splitgui.splitTime) return "&f";
    if (time === 0 || !time || time == undefined || time == null) {
        return "&f";
    }

    const colorMapping = {
        0: [29.5, 31, 35],
        1: [16, 18, 23],
        2: [5.4, 5.7, 6.2],
        3: [1.2, 1.5, 2],
        4: [2.8, 3.5, 4.5],
        5: [4, 4.5, 5],
        6: [1.5, 2, 2.5]
    };

    if (!colorMapping[arrayIndex]) {
        return "&f";
    }

    const timesArray = colorMapping[arrayIndex];

    if (time <= timesArray[0]) {
        return "&a";
    } else if (time <= timesArray[1]) {
        return "&6";
    } else {
        return "&c";
    }
}


function getC(time) {
    if (time <= 27) {
        return "&a";
    } else if (time <= 31) {
        return "&6";
    } else {
        return "&c";
    }
}

function resetConstants() {
    splits = [0, 0, 0, 0, 0, 0, 0, 0];
    times = [0, 0, 0, 0, 0, 0, 0];
    phase = 0;
    splits6Set = false;
    overall = 0;
    lines = {
        a: new Text(`${colors[0]}Supplies: &f0s`, pos[0] + 5, pos[1] + 5 * scale),
        b: new Text(`${colors[1]}Build: &f0s`, pos[0] + 5, pos[1] + 15 * scale),
        c: new Text(`${colors[2]}Eaten: &f0s`, pos[0] + 5, pos[1] + 25 * scale),
        d: new Text(`${colors[3]}Stun: &f0s`, pos[0] + 5, pos[1] + 35 * scale),
        e: new Text(`${colors[4]}DPS: &f0s`, pos[0] + 5, pos[1] + 45 * scale),
        f: new Text(`${colors[5]}Skip: &f0s`, pos[0] + 5, pos[1] + 55 * scale),
        g: new Text(`${colors[6]}Kuudra: &f0s`, pos[0] + 5, pos[1] + 65 * scale),
        h: new Text(`${colors[7]}Overall: &f0s`, pos[0] + 5, pos[1] + 75 * scale)
    };
    freshCount = 0;
    freshes = [];
    tickCount = 0;
    packetCount = 0;
    unregisterListener();
}


register('dragged', (dx, dy, x, y) => {
	if (!splitgui.SplitsGUI.isOpen()) return;
	data.splitscoords.x = x;
	data.splitscoords.y = y;
	data.save();
})

let pos = [0,0];

const xOffset = 5;
const yOffset = 10;

const example = {
    a: `${returnColor(splitgui.supplyColor)}Supplies: &f0s`,
    b: `${returnColor(splitgui.buildColor)}Build: &f0s`,
    c: `${returnColor(splitgui.eatenColor)}Eaten: &f0s`,
    d: `${returnColor(splitgui.stunColor)}Stun: &f0s`,
    e: `${returnColor(splitgui.DPSColor)}DPS: &f0s`,
    f: `${returnColor(splitgui.skipColor)}Skip: &f0s`,
    g: `${returnColor(splitgui.P4Color)}Kuudra: &f0s`,
    h: `${returnColor(splitgui.overallColor)}Overall: &f0s`
};

register("renderOverlay", () => {
    if (splitgui.SplitsGUI.isOpen()) {
        renderingExampleOverlay=true;
        resetColor();
        let pos = [data.splitscoords.x, data.splitscoords.y];

        // Renders
        if (!splitgui.NoDetail) {
            let t = 0;
            for (let k in example) {
                Renderer.drawStringWithShadow(example[k], pos[0] + xOffset, pos[1] + (t * yOffset * scale));
                t++;
            }
        } else {
            let exampleNoDetail = {
                a: `${returnColor(splitgui.supplyColor)}Supplies: &f0s`,
                b: `${returnColor(splitgui.buildColor)}Build: &f0s`,
                c: `${returnColor(splitgui.stunColor)}Stun: &f0s`,
                d: `${returnColor(splitgui.P4Color)}Kuudra: &f0s`
            };
            let t = 0;
            for (let k in exampleNoDetail) {
                Renderer.drawStringWithShadow(exampleNoDetail[k], pos[0] + xOffset, pos[1] + (t * yOffset * scale));
                t++;
            }
        }
    } else return  renderingExampleOverlay=false;
});


let renderingExampleOverlay = false;
let b_x = 83;
let b_y = 47;

register("worldLoad", () => {
    resetConstants();
})

register("step", () => {
    if (Skyblock.subArea !== "Kuudra's Hollow") return;
    if (splitgui.NoDetail) return b_y = 47;
    b_y = 88
    resetColor();
}).setFps(1)

//Phase 1: on run start
function RunStart() {
    resetConstants();
    registerListener();
    //sendDebugmsg("Run started");
    splits[0] = Date.now() / 1000;
    phase = 1;
}

//Phase 2: supply is done, starting build
function BuildStart() {
    //sendDebugmsg("Build started");
    splits[1] = Date.now() / 1000;
    phase = 2;
}

//Phase 3: build is done, waiting for stun to be eaten
function BuildFinish() {
    //sendDebugmsg("Build ended");
    splits[2] = Date.now() / 1000;
    phase = 3;
}

//Phase 4: stunner is eaten, waiting for stun
function Eaten() {
    //sendDebugmsg("Eaten!")
    splits[3] = Date.now() / 1000;
    phase = 4;
}

//Phase 5: kuudra is stunned, waiting for DPS
function Stun() {
    //sendDebugmsg("Kuudra stunned");
    splits[4] = Date.now() / 1000;
    phase = 5;
}

//Phase 6: DPS is done, waiting for skip
function DPS() {
    //sendDebugmsg("DPS finished");
    splits[5] = Date.now() / 1000;
    phase = 6;
}

//Phase 8: KUUDRA DOWN!
function KuudraDown() {
    splits[7] = Date.now() / 1000;
    phase = 8;
        sleep(500, () => {
            if (!splitgui.enableRunOverview) return;
            ChatLib.chat("  &4[chearys] Splits");
            ChatLib.chat(`${colors[0]}Supplies: ${getColorCode(times[0], 0)}${formatTimeMs(times[0])}`);
            ChatLib.chat(`${colors[1]}Build time: ${getColorCode(times[1], 1)}${formatTimeMs(times[1])}`);
            ChatLib.chat(`${colors[2]}Eaten time: ${getColorCode(times[2], 2)}${formatTimeMs(times[2])}`);
            ChatLib.chat(`${colors[3]}Stun time: ${getColorCode(times[3], 3)}${formatTimeMs(times[3])}`);
            ChatLib.chat(`${colors[4]}DPS time: ${getColorCode(times[4], 4)}${formatTimeMs(times[4])}`);
            ChatLib.chat(`${colors[5]}Skip time: ${getColorCode(times[5], 5)}${formatTimeMs(times[5])}`);
            ChatLib.chat(`${colors[6]}Kill time: ${getColorCode(times[6], 6)}${formatTimeMs(times[6])}`);
            ChatLib.chat(`&4P3: &f${formatTimeMs(parseFloat(times[2]) + parseFloat(times[3]) + parseFloat(times[4]))}`);
            ChatLib.chat(`&4P4: &f${formatTimeMs(parseFloat(times[5]) + parseFloat(times[6]))}`);
            ChatLib.chat(`&4Overall: &f${formatTime(overall)}`);
            ChatLib.chat(`  &4[chearys] Misc. Info`);
            ChatLib.chat(`${formatFreshes()}`);
            ChatLib.chat(`&cServer lagged for &f${((tickCount - packetCount) / 1000).toFixed(2)}s (${((tickCount - packetCount) / 50)} ticks)`);
        });
    sleep(1000, () => {
        resetConstants();
    });
}



//Chat messages
register("chat", (msg) => {
    if (Skyblock.subArea !== "Kuudra's Hollow") return;
    switch (true) {
        case msg.includes("Okay adventurers, I will go and fish up Kuudra!"):
            RunStart();
            break;
        case msg.includes("OMG! Great work collecting my supplies!"):
            BuildStart();
            break;
        case msg.includes("Phew! The Ballista is finally ready! It should be strong enough to tank Kuudra's blows now!"):
            BuildFinish();
            break;
        case msg.includes("has been eaten by Kuudra!") && phase === 3 && !msg.includes("Elle"):
            Eaten();
            break;
        case msg.includes("destroyed one of Kuudra's pods!"):
            Stun();
            break;
        case msg.includes("POW! SURELY THAT'S IT! I don't think he has any more in him!"):
            DPS();
            break;
        case msg.includes("KUUDRA DOWN!"):
            KuudraDown();
            break;
        case msg.includes("DEFEAT"):
            KuudraDown();
            break;
        case msg.includes("FRESH"):
            freshCount++;
            break;
    }
}).setCriteria("${msg}")

function updateTime() {

    let lagCompensation = Math.max((packetCount - tickCount) / 20, 0);

    switch (Math.floor(phase)) {
        case (1): {
            times[0] = (Date.now() / 1000 - splits[0] + lagCompensation).toFixed(2); // Update time for phase 1
            break;
        }

        case (2): {
            times[0] = (splits[1] - splits[0] + lagCompensation).toFixed(2); // Supply time (Static)
            times[1] = ((Date.now() / 1000 - splits[1] + lagCompensation)).toFixed(2); // Build time (start)
            break;
        }
        case (3): {
            times[1] = (splits[2] - splits[1] + lagCompensation).toFixed(2); // Build time (Static)
            times[2] = ((Date.now() / 1000 - splits[2] + lagCompensation)).toFixed(2); // Eaten time (start)
            break;
        }
        case (4): {
            times[2] = (splits[3] - splits[2] + lagCompensation).toFixed(2); // Eaten time (Static)
            times[3] = ((Date.now() / 1000 - splits[3] + lagCompensation)).toFixed(2); // Pure Stun time (start)
            break;
        }
        case (5): {
            times[3] = (splits[4] - splits[3] + lagCompensation).toFixed(2); // Pure Stun time (Static)
            times[4] = ((Date.now() / 1000 - splits[4] + lagCompensation)).toFixed(2); // DPS time (start)
            break;
        }
        case (6): {
            times[4] = (splits[5] - splits[4] + lagCompensation).toFixed(2); // DPS time (static)
            if (splits[5] !== 0 && splits[5] !== undefined) {
                if (Date.now() / 1000 > splits[5]) {
                    times[5] = ((Date.now() / 1000 - splits[5] + lagCompensation)).toFixed(2);  // skip (start)
                } else {
                    times[5] = 0;
                }
            }
            break;
        }

        case (7): {
            times[5] = (splits[6] - splits[5] + lagCompensation).toFixed(2); // skip (static)
            if (splits[6] !== 0 && splits[6] !== undefined) {
                if (Date.now() / 1000 > splits[6]) {
                    times[6] = ((Date.now() / 1000 - splits[6] + lagCompensation)).toFixed(2);  // skip (start)
                } else {
                    times[6] = 0;
                }
            }
            break;  // kuudra kill (start)
        }
        case (8): {
            times[6] = (splits[7] - splits[6] + lagCompensation).toFixed(2); // KUUDRA KILL (static)
            break;
        }
    }
    
    times.forEach((time, i) => {
        if (time > 1000000) {
            times[i] = 0;
        }
    });
     // Phase 7
     if (Math.round(Player.getY()) < 10 && !splits6Set && phase === 6) {
        splits[6] = Date.now() / 1000;
        splits6Set = true;
        phase = 7;
    }

    overall = Math.floor(
        parseFloat(times[0] || 0) + 
        parseFloat(times[1] || 0) + 
        parseFloat(times[2] || 0) + 
        parseFloat(times[3] || 0) + 
        parseFloat(times[4] || 0) + 
        parseFloat(times[5] || 0) + 
        parseFloat(times[6] || 0) + 
        lagCompensation
    ).toFixed(2);
    
    if (phase > 0) {
        if (!splitgui.NoDetail) {
            lines = {
                a: new Text(`${colors[0]}Supplies: ${getColorCode(times[0], 0)}${formatTimeMs(times[0])}`, pos[0] + 5, pos[1] + 5 * scale),
                b: new Text(`${colors[1]}Build: ${getColorCode(times[1], 1)}${formatTimeMs(times[1])}`, pos[0] + 5, pos[1] + 15 * scale),
                c: new Text(`${colors[2]}Eaten: ${getColorCode(times[2], 2)}${formatTimeMs(times[2])}`, pos[0] + 5, pos[1] + 25 * scale),
                d: new Text(`${colors[3]}Stun: ${getColorCode(times[3], 3)}${formatTimeMs(times[3])}`, pos[0] + 5, pos[1] + 35 * scale),
                e: new Text(`${colors[4]}DPS: ${getColorCode(times[4], 4)}${formatTimeMs(times[4])}`, pos[0] + 5, pos[1] + 45 * scale),
                f: new Text(`${colors[5]}Skip: ${getColorCode(times[5], 5)}${formatTimeMs(times[5])}`, pos[0] + 5, pos[1] + 55 * scale),
                g: new Text(`${colors[6]}Kuudra: ${getColorCode(times[6], 6)}${formatTimeMs(times[6])}`, pos[0] + 5, pos[1] + 65 * scale),
                h: new Text(`${colors[7]}Overall: &f${formatTime(overall)}`, pos[0] + 5, pos[1] + 75 * scale)
            };
        } else {
            let stun = (parseFloat(times[2]) + parseFloat(times[3]) + parseFloat(times[4])).toFixed(2);
            let kuudra = (parseFloat(times[5]) + parseFloat(times[6])).toFixed(2);
            lines = {
                a: new Text(`${colors[0]}Supplies: ${getColorCode(times[0], 0)}${formatTimeMs(times[0])}`, pos[0] + 5, pos[1] + 5 * scale),
                b: new Text(`${colors[1]}Build: ${getColorCode(times[1], 1)}${formatTimeMs(times[1])}`, pos[0] + 5, pos[1] + 15 * scale),
                c: new Text(`${colors[3]}Stun: &f${formatTimeMs(stun)}`, pos[0] + 5, pos[1] + 25 * scale),
                d: new Text(`${colors[6]}Kuudra: &f${formatTimeMs(kuudra)}`, pos[0] + 5, pos[1] + 35 * scale)
            };
        }
    }
    

}
function updatePosition() {
    pos = [data.splitscoords.x, data.splitscoords.y];
}


registerWhen(register("step", () => {
    updateTime();

    if (splitgui.displayKS) return  updatePosition();
}).setFps(21), () =>  Skyblock.subArea === "Kuudra's Hollow")



function render() {

    switch (true) {
        case (times[0] > 10 && times[0] < 60):
            b_x = 86;
            break;
        case (times[0] > 60) && times[0] < 70:
            b_x = 92;
            break;
        case (times[0] > 70 && times[0] < 120):
            b_x = 98;
            break;
        case (times[0] > 150):
            break;
    }

    Renderer.drawRect(Renderer.color(0, 0, 0, Math.round(splitgui.KS_opacity * 100)), pos[0], pos[1], b_x * scale, b_y * scale);

    for (let w in lines) {
        lines[w].setScale(scale).draw();
    }

}

registerWhen(register('renderOverlay', render), () => splitgui.displayKS && Skyblock.subArea === "Kuudra's Hollow" && phase > 0 && !renderingExampleOverlay)


/**
 * Track Freshes
 */

let freshes = [];

function formatFreshes() {
    if (freshes.length === 0) {
        return "&c0 Fresh";
    }
    
    return freshes.map(([timestamp, ign], index) => {
        const lagCompensation = Math.max((packetCount - tickCount) / 20, 0);
        const t = (timestamp / 1000) - splits[1] + lagCompensation;
        return `${index + 1}. &f${ign} | &a${formatTimeMs(t.toFixed(2))}`;
    }).join("\n");
}


register("chat", (player, a , event) => {
    if (Skyblock.subArea !== "Kuudra's Hollow") return;
    // Get color
    if(!a.toLowerCase().includes("fresh")) return;
    let name = ChatLib.getChatMessage(event);
    name = name.split(":")[0].split("> ")[1];

    //(`${name} freshed!`);
    freshes.push([Date.now(), name]);

}).setCriteria("Party > ${player}: ${a}")

register("chat", () => {
    if (!Settings.annouceFresh || Skyblock.subArea !== "Kuudra's Hollow") return;
    ChatLib.command(`pc FRESH!`);
}).setCriteria("Your Fresh Tools Perk bonus doubles your building speed for the next 10 seconds!")

register("chat", (supply, event) => {
    if(!Settings.customSupplyMessage) return;

    let name = new Message(event).getFormattedText();
    name = name.toString().substring(0, name.indexOf("recovered") - 1);
    cancel(event);
    ChatLib.chat(`${name} ${Settings.customSupplyMessage} ${getC(times[0])}${formatTimeMs(times[0])}! &r&8(${supply}/6)`);
}).setCriteria("${*} recovered one of Elle's supplies! (${supply}/6)");
