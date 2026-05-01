// minimalui.js (Arquivo na Raiz)
import MinimalUILogo from './modules/component/logo.js';
import MinimalUINavigation from './modules/component/navigation.js';
import MinimalUIHotbar from './modules/component/hotbar.js';
import MinimalUIPlayers from './modules/component/players.js';
import MinimalUIControls from './modules/component/controls.js';
import MinimalUISidebar from './modules/component/sidebar.js';
// Patch e Util estão na raiz da pasta modules, conforme a imagem
import MinimalUIPatch from './modules/patch.js'; 
import MinimalUITheme from './modules/customization/theme.js';

Hooks.once('init', () => {
    try {
        MinimalUILogo.initSettings();
        MinimalUINavigation.initSettings();
        MinimalUIHotbar.initSettings();
        MinimalUIPlayers.initSettings();
        MinimalUIControls.initSettings();
        MinimalUISidebar.initSettings();
        MinimalUIPatch.initSettings();

        if (game.modules.get('lib-color-settings')?.active) {
            MinimalUITheme.initSettings();
        }
    } catch (err) {
        console.error("Minimal UI | Erro no initSettings:", err);
    }
});

Hooks.once('ready', () => {
    MinimalUILogo.initHooks();
    MinimalUINavigation.initHooks();
    MinimalUIHotbar.initHooks();
    MinimalUIPlayers.initHooks();
    MinimalUIControls.initHooks();
    MinimalUISidebar.initHooks();
    MinimalUIPatch.initHooks();

    if (game.modules.get('lib-color-settings')?.active) {
        MinimalUITheme.initHooks();
    }
    
    console.log("Minimal UI (v13 Fix) | Sistema pronto.");
});
