import MinimalUILogo from './modules/component/logo.js';
import MinimalUINavigation from './modules/component/navigation.js';
import MinimalUIHotbar from './modules/component/hotbar.js';
import MinimalUIPlayers from './modules/component/players.js';
import MinimalUIControls from './modules/component/controls.js';
import MinimalUISidebar from './modules/component/sidebar.js';
import MinimalUIPatch from './modules/component/patch.js';
import MinimalUITheme from './modules/customization/theme.js';

Hooks.once('init', () => {
    // Inicializa as configurações de cada componente usando o novo ID
    MinimalUILogo.initSettings();
    MinimalUINavigation.initSettings();
    MinimalUIHotbar.initSettings();
    MinimalUIPlayers.initSettings();
    MinimalUIControls.initSettings();
    MinimalUISidebar.initSettings();
    MinimalUIPatch.initSettings();
    
    // Verifica se a lib de cores está ativa antes de iniciar o tema
    if (game.modules.get('lib-color-settings')?.active) {
        MinimalUITheme.initSettings();
    }
});

Hooks.once('setup', () => {
    // Hooks de configuração inicial
});

Hooks.once('ready', () => {
    // Garante que o patch de compatibilidade rode ao iniciar
    MinimalUIPatch.initHooks();
    
    // Inicializa os hooks visuais de cada componente
    MinimalUILogo.initHooks();
    MinimalUINavigation.initHooks();
    MinimalUIHotbar.initHooks();
    MinimalUIPlayers.initHooks();
    MinimalUIControls.initHooks();
    MinimalUISidebar.initHooks();
    
    if (game.modules.get('lib-color-settings')?.active) {
        MinimalUITheme.initHooks();
    }

    console.log("Minimal UI (v13 Fix) | Sistema carregado com sucesso.");
});
