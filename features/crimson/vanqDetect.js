import renderBeaconBeam from "../../../BeaconBeam";
import Settings from "../../config";
import { registerWhen } from "../../utils/functions/reg";
import { sendDebugmsg } from "../../utils/functions/debug";
import RenderLib from '../../../RenderLib/index';
import Skyblock from "../../../BloomCore/Skyblock";
import { sendmsg } from "../../utils/functions/msg";
const EntityWither = Java.type('net.minecraft.entity.boss.EntityWither').class;

let entities = [];
let vanquishers = [];
let formatted = [];
let messageSent = false;

register("step", () => {
    if(!Settings.enableVanqESP || Skyblock.area !== "Crimson Isle") return;
    vanquishers = [];
    entities = World.getAllEntitiesOfType(EntityWither);
    vanquishers = entities.filter(entity => entity.getEntity().func_110138_aP() == 1024);

    detectVanquishers();
    formatWaypoints();
}).setFps(10)

function detectVanquishers() {
    vanquishers = [];
    let entities = World.getAllEntitiesOfType(EntityWither);

    vanquishers = entities.filter(entity => entity.getEntity().func_110138_aP() == 1024)
        .map(entity => {
            let name = entity.getName();
            if (name === "Wither") {
                name = "Vanquisher";
            }
            return {
                name: name,
                x: entity.getX(),
                y: entity.getY(),
                z: entity.getZ()
            };
        });

    if (vanquishers.length > 0 && !messageSent) {
        sendmsg(`Vanq Detected: ${JSON.stringify(vanquishers)}`);
        World.playSound("mob.cat.meow", 2, 0.5);
        messageSent = true;
    }
}

register('worldUnload', () => {
    resetConstants();
});

registerWhen(register("renderWorld", () => { renderWaypoints(); }), () => Settings.enableVanqESP && Skyblock.area === "Crimson Isle");

function resetConstants() {
    vanquishers.length = 0;
    formatted.length = 0;
    messageSent = false; 
}

function formatWaypoints() {
    let i = vanquishers.length;
    formatted = new Array(i);

    while (i--) {
        let vanquisher = vanquishers[i];
        let wp = [["", 0, 0, 0], [0, 0, 0]];
        let { x, y, z } = vanquisher;
        let distance = Player.asPlayerMP().distanceTo(x, y, z);

        if (distance >= 100) {
            x = Player.getX() + (x - Player.getX()) * (100 / distance);
            z = Player.getZ() + (z - Player.getZ()) * (100 / distance);
        }

        let xSign = x === 0 ? 1 : Math.sign(x);
        let zSign = z === 0 ? 1 : Math.sign(z);
        wp[0] = [`${vanquisher.name} §b[${~~distance}m]`, x + 0.5 * xSign, y - 1, z + 0.5 * zSign];

        if (xSign === 1) xSign = 0;
        if (zSign === 1) zSign = 0;
        wp[1] = [x + xSign, y - 1, z + zSign];

        formatted[i] = wp;
    }
}

function renderWaypoints() {
    let i = formatted.length;
    while (i--) {
        let waypoint = formatted[i];
        let box = waypoint[0];
        let beam = waypoint[1];
        let rgb = "#AA00AAFF";

        RenderLib.drawEspBox(box[1], box[2], box[3], 1, 1, rgb[0], rgb[1], rgb[2], 1, true);
        RenderLib.drawInnerEspBox(box[1], box[2], box[3], 1, 1, rgb[0], rgb[1], rgb[2], 0.25, true);
        Tessellator.drawString(box[0], box[1], box[2] + 1.5, box[3], "0xffffff", true);
        renderBeaconBeam(beam[0], beam[1], beam[2], rgb[0], rgb[1], rgb[2], 0.5, false);
    }
}