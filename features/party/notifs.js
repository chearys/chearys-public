import Settings from "../../config";
import { derank } from "../../utils/functions/derank";
import { sendDebugmsg } from "../../utils/functions/debug";
import { sleep } from "../../utils/functions/cooldown";
import { registerWhen } from "../../utils/functions/reg";

const t = ["joined the party.", "joined the dungeon group!", "joined the group!"];


register("chat", (msg) => {
    if(!Settings.joinNotifs) return;

    if (msg.includes("Party >")) return;

    for (let trigger of t) {
        if (msg.includes(trigger)) {
            World.playSound("mob.cat.meow", 2, 0.5);
            return;
        }
    }

}).setChatCriteria("${msg}")


