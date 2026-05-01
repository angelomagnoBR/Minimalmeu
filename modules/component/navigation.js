import {debouncedReload, rootStyle} from '../util.js';

export default class MinimalUINavigation {

    static initSettings() {
        game.settings.register('minimal-ui-personal', 'navigation', {
            name: game.i18n.localize("MINIMALUI.NavigationSettings"),
            hint: game.i18n.localize("MINIMALUI.NavigationSettingsHint"),
            scope: 'world',
            config: true,
            type: String,
            choices: {
                "shown": game.i18n.localize("MINIMALUI.SettingsAlwaysVisible"),
                "hover": game.i18n.localize("MINIMALUI.SettingsVisibleHover"),
                "collapsed": game.i18n.localize("MINIMALUI.SettingsCollapsed"),
                "hidden": game.i18n.localize("MINIMALUI.SettingsHidden")
            },
            default: "hover",
            onChange: debouncedReload
        });
    }

    static initHooks() {
        Hooks.on('renderSceneNavigation', (app, html) => {
            const navSettings = game.settings.get('minimal-ui-personal', 'navigation');
            
            // Corrige o erro da imagem: Verifica se o elemento existe antes de tentar ler classes
            // No v13, usamos standard JS ou garantimos que o elemento seja JQuery
            const webrtcElement = ui.webrtc?.element;
            const hasWebRtc = webrtcElement && webrtcElement.length > 0 && webrtcElement[0].classList.contains('active');

            if (navSettings === 'hidden') {
                html.hide();
            } else if (navSettings === 'collapsed') {
                if (app._collapsed) html.addClass('minimal-ui-collapsed');
            }
            
            rootStyle.setProperty('--nav-v13-patch', hasWebRtc ? '1' : '0');
        });
    }
}
