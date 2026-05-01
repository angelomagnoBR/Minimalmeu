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

            // Versão simplificada e ultra-segura para v13
            let hasWebRtc = false;
            const webrtc = ui.webrtc;
            
            if (webrtc?.element) {
                // Tenta pegar o elemento puro do JavaScript, independente de ser JQuery ou não
                const el = webrtc.element[0] || webrtc.element;
                if (el && el.classList) {
                    hasWebRtc = el.classList.contains('active');
                }
            }

            if (navSettings === 'hidden') {
                html.hide();
            } else if (navSettings === 'collapsed') {
                if (app._collapsed) {
                    if (typeof html.addClass === 'function') {
                        html.addClass('minimal-ui-collapsed');
                    } else {
                        html.classList?.add('minimal-ui-collapsed');
                    }
                }
            }
            
            rootStyle.setProperty('--nav-v13-patch', hasWebRtc ? '1' : '0');
        });
    }
}
