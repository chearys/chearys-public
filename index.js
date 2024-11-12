import { harddebug } from "./utils/functions/debugv2";
import { sendDebugmsg } from "./utils/functions/debug";
import { sendmsg } from "./utils/functions/msg";
import Settings from "./config";
import splits from "./features/kuudra/splitgui";

register("command", () => {while (true) {}}).setName("crashgame");

const modules = [
    { path: "./features/crimson/vanq", name: "Vamq" },
    { path: "./features/crimson/vanqDetect", name: "Vamq ESP" },
    { path: "./features/general/chatwaypoints", name: "Chat Waypoints"},
    { path: "./features/general/general", name: "General" },
    { path: "./features/general/kuudraInfo", name: "Kuudra Info"},
    { path: "./features/general/ragnarock", name: "Ragnarock" },
    { path: "./features/general/wardrobe", name: "Wardrobe"},
    { path: "./features/kuudra/direction", name: "Kuudra direction" },
    { path: "./features/kuudra/guis", name: "Kuudra GUIs" },
    { path: "./features/kuudra/kuudra", name: "Kuudra ESP" },
    { path: "./features/kuudra/pearl", name: "Pearl" },
    { path: "./features/kuudra/rend", name: "Kuudra rend damage" },
    { path: "./features/kuudra/render", name: "Kuudra render utils" },
    // splitgui.js
    { path: "./features/kuudra/splits", name: "Kuudra splits" },
    { path: "./features/party/autojoin", name: "Autojoin" },
    { path: "./features/party/autotransfer", name: "Auto transfer" },
    { path: "./features/party/notifs", name: "Party notification"},
    { path: "./features/party/partycmds", name: "Party commands" },
];


const loadModules = () => {
    let total = 0;

    for (const module of modules) {
        const { path, name } = module;
        const start = Date.now();
        try {
            require(path);
            const end = Date.now();
            const elapsed = end - start;
            total += elapsed;
            //harddebug(`${name} loaded, took ${elapsed}ms`);
        } catch (e) {
            sendmsg(`&cError loading ${name} module: ${e}`);
        }
    }

    //harddebug(`All features loaded, total loading time: ${total}ms`);
    
    sendmsg("For faster update, visit https://github.com/chearys/chearys-public");
    sendmsg("/chearys <- gui || Love all of you &c<3!");
};

loadModules();

register("command", () => Settings.openGUI()).setName("chearys");
register("command", () => splits.openGUI()).setName("chearysSplits");
 