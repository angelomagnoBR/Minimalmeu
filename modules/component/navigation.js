import {debouncedReload, rootStyle} from '../util.js';


export default class MinimalUINavigation {

    static cssSceneNavNoLogoStart = 0;
    static cssSceneNavLogoStart = 110;

    static async collapseNavigation() {
        // Na v13, ui.nav.collapse() retorna uma Promise, garantindo que o estado mude antes de prosseguir
        if (ui.nav) await ui.nav.collapse();
    }

    static positionNav() {
        // Usa o novo ID para ler se o logo está escondido e calcular a posição X
        let navixpos = game.settings.get('minimal-ui-personal', 'foundryLogoSize') === 'hidden' ? MinimalUINavigation.cssSceneNavNoLogoStart : MinimalUINavigation.cssSceneNavLogoStart;
        
        // Ajuste para WebRTC (Câmeras) na v13
        if (game.webrtc.mode > 0 && !ui.webrtc.element.hasClass('hidden')) {
            if (game.webrtc.settings.client.dockPosition === 'left') {
                navixpos += ui.webrtc.position.width || 0;
            }
        }
        rootStyle.setProperty('--navixpos', navixpos + 'px');
    }

    static initSettings() {

        game.settings.register('minimal-ui-personal', 'sceneNavigation', {
            name: game.i18n.localize("MinimalUI.NavigationStyleName"),
            hint: game.i18n.localize("MinimalUI.NavigationStyleHint"),
            scope: 'world',
            config: true,
            type: String,
            choices: {
                "shown": game.i18n.localize("MinimalUI.SettingsStartVisible"),
                "collapsed": game.i18n.localize("MinimalUI.SettingsCollapsed"),
                "hidden": game.i18n.localize("MinimalUI.SettingsHide")
            },
            default: "collapsed",
            onChange: MinimalUINavigation.positionNav
        });

        game.settings.register('minimal-ui-personal', 'sceneNavigationSize', {
            name: game.i18n.localize("MinimalUI.NavigationSizeName"),
            hint: game.i18n.localize("MinimalUI.NavigationSizeHint"),
            scope: 'world',
            config: true,
            type: String,
            choices: {
                "small": game.i18n.localize("MinimalUI.SettingsSmall"),
                "standard": game.i18n.localize("MinimalUI.SettingsStandard"),
                "big": game.i18n.localize("MinimalUI.SettingsBig")
            },
            default: "small",
            onChange: debouncedReload
        });

        // Corrigido: Adicionado chaves para que o ajuste de margem seja exclusivo do Starfinder
        if (game.system.id === 'sfrpg') {
            rootStyle.setProperty('--navileft', '-1px');
            rootStyle.setProperty('--naviright', '5px');
        }

    }

    static initHooks() {

        Hooks.once('renderSceneNavigation', async function () {

            // Sincroniza margens com o tamanho do logo definido no novo ID
            const logoSize = game.settings.get('minimal-ui-personal', 'foundryLogoSize');
            switch (logoSize) {
                case 'small': {
                    rootStyle.setProperty('--navixmg', '25px');
                    break;
                }
                case 'hidden': {
                    rootStyle.setProperty('--navixmg', '10px');
                    break;
                }
            }

            const navStyle = game.settings.get('minimal-ui-personal', 'sceneNavigation');
            switch (navStyle) {
                case 'collapsed': {
                    MinimalUINavigation.collapseNavigation();
                    rootStyle.setProperty('--navivis', 'visible');
                    break;
                }
                case 'shown': {
                    rootStyle.setProperty('--navivis', 'visible');
                    break;
                }
                case 'hidden': {
                    rootStyle.setProperty('--navivis', 'hidden');
                    break;
                }
            }

            const navSize = game.settings.get('minimal-ui-personal', 'sceneNavigationSize');
            switch (navSize) {
                case 'standard': {
                    rootStyle.setProperty('--navilh', '32px');
                    rootStyle.setProperty('--navifs', '16px');
                    rootStyle.setProperty('--navilisttop', '24px');
                    rootStyle.setProperty('--navibuttonsize', '34px');
                    break;
                }
                case 'big': {
                    rootStyle.setProperty('--navilh', '40px');
                    rootStyle.setProperty('--navifs', '20px');
                    rootStyle.setProperty('--navilisttop', '30px');
                    rootStyle.setProperty('--navibuttonsize', '43px');
                    break;
                }
            }

        });

        // Atualiza posição sempre que a navegação for renderizada (ex: trocar de cena)
        Hooks.on('renderSceneNavigation', function () {
            MinimalUINavigation.positionNav();
        });

        Hooks.on('rtcSettingsChanged', function () {
            MinimalUINavigation.positionNav();
        });

    }

}
