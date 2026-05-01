// minimalui.js (Arquivo Raiz)
import MinimalUILogo from './modules/component/logo.js';
import MinimalUINavigation from './modules/component/navigation.js';
import MinimalUIHotbar from './modules/component/hotbar.js';
import MinimalUIPlayers from './modules/component/players.js';
import MinimalUIControls from './modules/component/controls.js';
import MinimalUISidebar from './modules/component/sidebar.js';
import MinimalUIPatch from './modules/component/patch.js';
import MinimalUITheme from './modules/customization/theme.js';

Hooks.once('init', () => {
    // Registra as configurações usando o novo ID 'minimal-ui-personal'
    try {
        MinimalUILogo.initSettings();
        MinimalUINavigation.initSettings();
        MinimalUIHotbar.initSettings();
        MinimalUIPlayers.initSettings();
        MinimalUIControls.initSettings();
        MinimalUISidebar.initSettings();
        MinimalUIPatch.initSettings();

        // Só tenta o tema se a biblioteca existir
        if (game.modules.get('lib-color-settings')?.active) {
            MinimalUITheme.initSettings();
        }
    } catch (err) {
        console.error("Minimal UI | Erro fatal no registro de configurações:", err);
    }
});

Hooks.once('ready', () => {
    // Ativa os hooks visuais
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
    
    console.log("Minimal UI (v13 Fix) | Carregado com sucesso.");
});
