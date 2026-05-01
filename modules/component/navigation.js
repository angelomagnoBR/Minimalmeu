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

            // PROTEÇÃO TOTAL: Se ui.webrtc não existir ou não for JQuery, o código não quebra
            let hasWebRtc = false;
            try {
                const webrtc = ui.webrtc;
                if (webrtc && webrtc.element && typeof webrtc.element.hasClass === 'function') {
                    hasWebRtc = webrtc.element.hasClass('active');
                } else if (webrtc && webrtc.element && webrtc.element[0]) {
                    hasWebRtc = webrtc.element[0].classList.contains('active');
                }
            } catch (e) {
                console.warn("Minimal UI | Falha ao detectar WebRTC, ignorando...");
            }

            if (navSettings === 'hidden') {
                html.hide();
            } else if (navSettings === 'collapsed') {
                if (app._collapsed) html.addClass('minimal-ui-collapsed');
            }
            
            rootStyle.setProperty('--nav-v13-patch', hasWebRtc ? '1' : '0');
        });
    }
}
