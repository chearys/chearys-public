import Settings from '../../config';
import Skyblock from "../../../BloomCore/Skyblock";
import { registerWhen } from "../../utils/functions/reg";
import { formatHealth } from '../../utils/functions/h';
import { getPhase } from './splits';

const EntityMagmaCube = Java.type('net.minecraft.entity.monster.EntityMagmaCube');
let cubes = World.getAllEntitiesOfType(EntityMagmaCube.class);
let HPDisplay = ["100,000/100,0000 ❤", 0, 0, 0];
let percentHP = new Text(`Unable to find Kuudra`, Renderer.screen.getWidth() / 2 - 69 / 2, 10);
let currentHP = 0;

export function getKuudraHP() { return currentHP };

function getPercentColor(percent) {
    if (percent >= 80) return "§a"; // Green (100%-80%)
    else if (percent >= 60) return "§2"; // Dark Green (80%-60%)
    else if (percent >= 40) return "§e"; // Yellow (60%-40%)
    else if (percent >= 20) return "§6"; // Gold (40%-20%)
    else return "§c"; // Red (20%-0%)
}


registerWhen(register("tick", () => {
    cubes = World.getAllEntitiesOfType(EntityMagmaCube.class);

    const kuudra = cubes.find((cube) => cube.getWidth().toFixed(1) == 15.3 && cube.getEntity().func_110143_aJ() <= 100_000);
    if (kuudra !== undefined) {
        currentHP = kuudra.getEntity().func_110143_aJ();

        if (Settings.enableKuudraHP) {
            const phase = getPhase();
            let color;
            let percent;

            if (phase >= 1 && phase <= 6) {
                percent = Math.max(0, ((currentHP - 25_000) / 75_000 * 100)).toFixed(2);
                color = getPercentColor(percent);

                HPDisplay = [`${color + formatHealth(parseFloat(currentHP).toFixed(2))}§7/§a100k §c❤`, kuudra.getX(), kuudra.getY(), kuudra.getZ()];
                percentHP = new Text(`${color}${percent}%`, Renderer.screen.getWidth() / 2 - Renderer.getStringWidth(percent) / 2, 10);
            }
            else if (phase === 7 || phase === 8) {
                const realHP = currentHP * 9600;
                percent = (realHP / 240_000_000 * 100).toFixed(2);
                color = getPercentColor(percent);

                HPDisplay = [`${color + formatHealth(realHP.toFixed(2))}§7/§a240M §c❤`, kuudra.getX(), kuudra.getY(), kuudra.getZ()];
                percentHP = new Text(`${color}${percent}%`, Renderer.screen.getWidth() / 2 - Renderer.getStringWidth(percent) / 2, 10);
            }
        }

        if (Settings.enableKuudraDirection && currentHP <= 25_000 && currentHP > 24_900) {
            const x = kuudra.getX();
            const z = kuudra.getZ();

            if (x < -128) Client.showTitle("§c§lRIGHT!", "", 0, 25, 5);
            else if (z > -84) Client.showTitle("§2§lFRONT!", "", 0, 25, 5);
            else if (x > -72) Client.showTitle("§a§lLEFT!", "", 0, 25, 5);
            else if (z < -132) Client.showTitle("§4§lBACK!", "", 0, 25, 5);
        }
    } else HPDisplay = ["100k/100k ❤", 0, 0, 0];
}), () => Skyblock.subArea === "Kuudra's Hollow");

const DIRECTIONS = new Set(["§c§lRIGHT!", "§2§lFRONT!", "§a§lLEFT!", "§4§lBACK!"]);
registerWhen(register("renderTitle", (title, _, event) => {
    if (currentHP > 25_000 || currentHP <= 24_900 || DIRECTIONS.has(title)) return;
    cancel(event);
}), () => Skyblock.subArea === "Kuudra's Hollow" && Settings.enableKuudraDirection);

registerWhen(register('renderOverlay', () => {
    percentHP.draw();
}), () => Skyblock.subArea === "Kuudra's Hollow" && Settings.enableKuudraHPPercent);

registerWhen(register('renderWorld', () => {
    if (HPDisplay[1]) Tessellator.drawString(HPDisplay[0], HPDisplay[1], HPDisplay[2] + 10, HPDisplay[3], 0xA7171A, true, 0.25, false);
}), () => Skyblock.subArea === "Kuudra's Hollow" && Settings.enableKuudraHP);

register('worldUnload', () => {
    percentHP = new Text(`Unable to find Kuudra`, Renderer.screen.getWidth() / 2 - 69 / 2, 10);
    HPDisplay = ["100k/100k ❤", 0, 0, 0];
});
