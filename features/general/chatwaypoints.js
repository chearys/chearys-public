import renderBeaconBeam from "../../../BeaconBeam"
import Settings from "../../config"
import { registerWhen } from "../../utils/functions/reg";
import { sleep } from "../../utils/functions/cooldown";
import { sendDebugmsg } from "../../utils/functions/debug";
import RenderLib from '../../../RenderLib/index';

let formatted = []
let chatWaypoints = []

registerWhen(register("tick", () => {
  formatWaypoints();
}), () => Settings.waypoint > 0)

registerWhen(register("renderWorld", () => {
    renderWaypoints();
}), () => formatted.length > 0 )
  
register('worldUnload', () => {
    resetConstants();
})

function resetConstants() {
    chatWaypoints.length = 0;
    formatted.length = 0;
  }

function formatWaypoints() {

  let i = chatWaypoints.length;
  formatted = new Array(i);

  while (i--) {
    let waypoint = chatWaypoints[i]
    let wp = [["", 0, 0, 0], [0, 0, 0]];
    let [x, y, z] = [waypoint[1], waypoint[2], waypoint[3]];
    let distance = Player.asPlayerMP().distanceTo(x, y, z)

    if (distance >= 100) {
      x = Player.getX() + (x - Player.getX()) * (100 / distance);
      z = Player.getZ() + (z - Player.getZ()) * (100 / distance);
    }

    let xSign = x === 0 ? 1 : Math.sign(x);
    let zSign = z === 0 ? 1 : Math.sign(z);
    wp[0] = [`${waypoint[0]} §b[${~~distance}m]`, x + 0.5*xSign, y - 1, z + 0.5*zSign];

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
    //   let rgb = getRGB1(settings.waypointColor);
      let rgb = "#ff00ffff";
  
      RenderLib.drawEspBox(box[1], box[2], box[3], 1, 1, rgb[0], rgb[1], rgb[2], 1, true);
      RenderLib.drawInnerEspBox(box[1], box[2], box[3], 1, 1, rgb[0], rgb[1], rgb[2], 0.25, true);
      Tessellator.drawString(box[0], box[1], box[2] + 1.5, box[3], 0xffffff, true);
      renderBeaconBeam(beam[0], beam[1], beam[2], rgb[0], rgb[1], rgb[2], 0.5, false);
    }
  }

register("chat", (player, _ , x, y, z) => {
  if (Settings.waypoint <= 0) return;

    // Gets colors and titles in name
    player = ChatLib.addColor(player.split("> ").slice(-1).toString());
  
    // Remove anything after z coords
    z = z.split(" ")[0];
    
    chatWaypoints.push([player, parseInt(x), parseInt(y), parseInt(z)]);
    //sendDebugmsg(chatWaypoints);
    // Delete waypoint after 'X' seconds
    sleep(Settings.waypoint*1000, () => {
        if (chatWaypoints.length) chatWaypoints.shift(); 
    })
  
    // x: -359, y: 86, z: -524 |  ⏣ Stronghold
    // &r&9Party &8> &6[MVP&8++&6] nwjn&f: &rx: -363, y: 63, z: -846 &r
  }).setCriteria("${player}:${spacing}x: ${x}, y: ${y}, z: ${z}&r")

