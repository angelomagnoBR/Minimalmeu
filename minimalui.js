import MinimalUIControls from './modules/component/controls.js'
import MinimalUIHotbar from './modules/component/hotbar.js'
import MinimalUILogo from './modules/component/logo.js'
import MinimalUINavigation from './modules/component/navigation.js'
import MinimalUIPlayers from './modules/component/players.js'
import MinimalUISidebar from './modules/component/sidebar.js'

import MinimalUITheme from './modules/customization/theme.js'

import MinimalUIPatch from "./modules/patch.js";

class MinimalUI {
    static noColorSettings = false;
}

// Na v13, usar 'setup' garante que as dependências (como colorsettings) já foram verificadas
Hooks.once('setup', () => {

    /** Initialize settings for Theme Functionality */
    if (game.modules.get('colorsettings')?.active) {
        MinimalUITheme.initSettings();
        MinimalUITheme.initHooks();
    } else {
        MinimalUI.noColorSettings = true;
    }
    /** ------------------------- */

    /** Initialize settings for Core Component Functionality */
    MinimalUILogo.initSettings();
    MinimalUINavigation.initSettings();
    MinimalUIControls.initSettings();
    MinimalUIHotbar.initSettings();
    MinimalUISidebar.initSettings();
    MinimalUIPlayers.initSettings();
    /** ------------------------- */

    /** Initialize hooks for Core Component Functionality */
    MinimalUILogo.initHooks();
    MinimalUINavigation.initHooks();
    MinimalUIControls.initHooks();
    MinimalUIHotbar.initHooks();
    MinimalUISidebar.initHooks();
    MinimalUIPlayers.initHooks();
    /** ------------------------- */

    /** Initialize Foundry UI Patches */
    MinimalUIPatch.initSettings();
    MinimalUIPatch.initHooks();
    /** ------------------------- */

});

Hooks.once('ready', () => {
    // Verificação de segurança adicional para o GM
    if (MinimalUI.noColorSettings && game.user.isGM) {
        ui.notifications.warn("Minimal UI (v13 Fix): Algumas funções de cores estão desativadas porque o módulo 'lib - colorsettings' não foi encontrado.");
    }
});
