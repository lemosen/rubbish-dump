// src/index.ts

import { System } from "./services/system";
import { UIService } from "./services/ui";

let interval: any;
window.start = () => {
    console.log("start");
    if (interval) {
        return;
    }
    const system = new System();
    const uiService = new UIService();
    interval = setInterval(() => {
        if (!uiService.isPaused && !uiService.isWaitStart) {
            system.calculate();
        }
        if (uiService.isRestart) {
            system.init();
            uiService.isRestart = false;
        }
        uiService.render(system.player, system.enemies, system.portal1, system.portal2);
    }, 1000 / 60);
};
