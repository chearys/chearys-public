import renderBeaconBeam from "../../../BeaconBeam";
import Settings from "../../config";
import { getPhase } from "./splits";
import { registerWhen } from "../../utils/functions/reg";
import Skyblock from "../../../BloomCore/Skyblock";
import { sleep } from "../../utils/functions/cooldown";
import { sendmsg } from "../../utils/functions/msg";
import { sendDebugmsg } from "../../utils/functions/debug";

const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand");
const EntityGiant = Java.type("net.minecraft.entity.monster.EntityGiantZombie");

const COORDINATES = {
    SHOP: [-81, 76, -143],
    XCANNON: [-143, 76, -125],
    SQUARE: [-143, 76, -80],
    LOCATIONS: {
        TRIANGLE: [-67.5, 77, -122.5],
        X: [-142.5, 77, -151],
        EQUALS: [-65.5, 76, -87.5],
        SLASH: [-113.5, 77, -68.5]
    }
};

const SUPPLY_COORDINATES = [
    [-98, -112],
    [-98, -99],
    [-110, -106],
    [-106, -112],
    [-94, -106],
    [-106, -99]
];

function getDistance(array1, array2) {
    return Math.abs(Math.hypot(array1[0] - array2[0], array1[1] - array2[1], array1[2] - array2[2]));
}

let zzz = {
    preSpot: null,
    preLoc: null,
    supplies: [true, true, true, true, true, true],
    missing: null
};

function resetConstants() {
    zzz = {
        preSpot: null,
        preLoc: null,
        supplies: [true, true, true, true, true, true],
        missing: null
    };
}

/**
 * Find pre spot
 */
register("chat", () => {
    if (Skyblock.subArea !== "Kuudra's Hollow") return;
    sleep(9000, () => {
        //sendDebugmsg("updating supplies");
        if (Player.asPlayerMP().distanceTo(-67.5, 77, -122.5) < 15) {
            zzz.preSpot = "Triangle";
            zzz.preLoc = [-67.5, 77, -122.5];
        } else if (Player.asPlayerMP().distanceTo(-142.5, 77, -151) < 30) {
            zzz.preSpot = "X";
            zzz.preLoc = [-142.5, 77, -151];
        } else if (Player.asPlayerMP().distanceTo(-65.5, 76, -87.5) < 15) {
            zzz.preSpot = "Equals";
            zzz.preLoc = [-65.5, 76, -87.5];
        } else if (Player.asPlayerMP().distanceTo(-113.5, 77, -68.5) < 15) {
            zzz.preSpot = "Slash";
            zzz.preLoc = [-113.5, 77, -68.5];
        }
    });
    sleep(11500, () => {
        //sendDebugmsg("checking pre/second");
        if (!zzz.preSpot) return sendmsg("Could not determine your pre spot (too far away?)");

        const crates = World.getAllEntitiesOfType(EntityGiant.class).filter(e =>
            e.getEntity().func_70694_bm()?.toString() == "1xitem.skull@3"
        ).map(giant => {
            const yaw = giant.getYaw();
            const x = giant.getX() + (3.7 * Math.cos((yaw + 130) * (Math.PI / 180)));
            const z = giant.getZ() + (3.7 * Math.sin((yaw + 130) * (Math.PI / 180)));
    
            return ([x, 75, z]);
        });
    
        let pre = false;
        let second = false;
    
        let i = crates.length;
        while (i--) {
            const crate = crates[i];
            if (getDistance(zzz.preLoc, crate) < 18) pre = true;
    
            if (zzz.preSpot == "Triangle") {
                if (getDistance(COORDINATES.SHOP, crate) < 18) second = true;
            } else if (zzz.preSpot == "X") {
                if (getDistance(COORDINATES.XCANNON, crate) < 16) second = true;
            } else if (zzz.preSpot == "Slash") {
                if (getDistance(COORDINATES.SQUARE, crate) < 20) second = true;
            }
        }
        if (!pre) {
            if (Settings.enableNoPre) ChatLib.say(`/pc No ${zzz.preSpot}!`);
        } else if (!second) {
            switch (zzz.preSpot) {
                case "Triangle": second = "Shop"; break;
                case "X": second = "X Cannon"; break;
                case "Slash": second = "Square"; break;
                default: return;
            }
            if (Settings.enableNoPre) ChatLib.say(`/pc No ${second}!`);
        }
    });
}).setCriteria("[NPC] Elle: Okay adventurers, I will go and fish up Kuudra!")

register("chat", (supply) => {
    if (Skyblock.subArea !== "Kuudra's Hollow") return;
    zzz.missing = supply;
}).setCriteria("Party > ${*}: No ${supply}!")

register("step", () => {
    if (!Settings.enableNoSupply || Skyblock.subArea !== "Kuudra's Hollow") return;
    const piles = World.getAllEntitiesOfType(EntityArmorStand.class).filter(e =>
        e.getName().includes("SUPPLIES RECEIVED")
    );

    piles.forEach(pile => {
        const [x, z] = [~~pile.getX(), ~~pile.getZ()];
        SUPPLY_COORDINATES.forEach((coord, index) => {
            if (x === coord[0] && z === coord[1]) {
                zzz.supplies[index] = false;
            }
        });
    });
}).setFps(2)

register("worldLoad", () => {
    resetConstants();
})

registerWhen(register("renderWorld", () => {
    const missing = zzz.missing;

    SUPPLY_COORDINATES.forEach((coord, index) => {
        if (zzz.supplies[index]) {
            let color = [1, 1, 1];
            if ((index === 0 && missing === "Shop") || (index === 1 && missing === "Equals") || 
                (index === 2 && missing === "X Cannon") || (index === 3 && missing === "X") || 
                (index === 4 && missing === "Triangle") || (index === 5 && missing === "Slash")) {
                color = [1, 0, 0];
            }
            renderBeaconBeam(coord[0], 79, coord[1], ...color, 0.8, true, 100);
        }
    });
}), () => getPhase() == 1 && Skyblock.subArea === "Kuudra's Hollow" && Settings.enableNoSupply)

let giants = [];

registerWhen(register("tick", () => {
    giants = World.getAllEntitiesOfType(EntityGiant.class).filter(e =>
      e.getEntity().func_70694_bm()?.toString() == "1xitem.skull@3"
    ).map(giant => {
      const yaw = giant.getYaw()
      const x = giant.getRenderX() + (3.7 * Math.cos((yaw + 130) * (Math.PI / 180)));
      const z = giant.getRenderZ() + (3.7 * Math.sin((yaw + 130) * (Math.PI / 180)));
  
      return ([x, 75, z])
    })
  }), () => getPhase() == 1 && Settings.enableSupplyBeacon)

registerWhen(register("renderWorld", () => {
    let i = giants.length
    while (i--) {
      let giant = giants[i]
  
      renderBeaconBeam(
        ...giant,
        ...[0, 1, 1, 0.8],
        true,
        100
      );
    }
  }), () => getPhase() == 1 && Settings.enableSupplyBeacon)