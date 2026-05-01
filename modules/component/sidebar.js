import {rootStyle} from '../util.js';
import '../../styles/component/sidebar.css';

export default class MinimalUISidebar {

    static initSettings() {
        // MUDE 'minimal-ui' para 'minimal-ui-personal' se você alterou o ID no module.json
        game.settings.register('minimal-ui-personal', 'rightcontrolsBehaviour', {
            name: game.i18n.localize("MinimalUI.SidebarStyleName"),
            hint: game.i18n.localize("MinimalUI.SidebarStyleHint"),
            scope: 'world',
            config: true,
            type: String,
            choices: {
                "shown": game.i18n.localize("MinimalUI.SettingsStartVisible"),
                "collapsed": game.i18n.localize("MinimalUI.SettingsCollapsed")
            },
            default: "shown"
        });
    }

    static initHooks() {
        // Na v13, renderSidebar é mais garantido que renderChatLog para manipular a barra toda
        Hooks.once('renderSidebar', async function (app, html) {
            const sidebarElem = html.find("#sidebar-tabs"); // Uso do html.find é mais seguro na v13
            
            // Verifica se o elemento existe antes de mexer no CSS
            if (sidebarElem.length) {
                const currentHeight = sidebarElem.css('--sidebar-tab-height') || "32px";
                const newHeight = parseInt(currentHeight) / 1.25;
                sidebarElem.css('--sidebar-tab-height', newHeight + 'px');
            }

            // Pega a configuração (ajuste o ID aqui também)
            const behaviour = game.settings.get('minimal-ui-personal', 'rightcontrolsBehaviour');

            switch (behaviour) {
                case 'shown': {
                    rootStyle.setProperty('--fpsvis', 'unset');
                    rootStyle.setProperty('--controlsvis', 'visible');
                    break;
                }
                case 'collapsed': {
                    // Na v13, ui.sidebar pode demorar um pouco mais para estar pronto
                    if (ui.sidebar && !ui.sidebar._collapsed) {
                        ui.sidebar.collapse();
                    }
                    rootStyle.setProperty('--controlsvis', 'visible');
                    break;
                }
                default: {
                    rootStyle.setProperty('--fpsvis', 'unset');
                    rootStyle.setProperty('--controlsvis', 'visible');
                    break;
                }
            }
        });

        Hooks.on('collapseSidebar', function(sidebar, isCollapsing) {
            // A v13 mudou a largura padrão da sidebar em alguns sistemas, 
            // 300px pode precisar de ajuste dependendo do seu CSS
            if (isCollapsing) {
                rootStyle.setProperty('--fpsposx', '-5px');
                rootStyle.setProperty('--fpsvis', 'unset');
            } else {
                rootStyle.setProperty('--fpsposx', '300px');
                rootStyle.setProperty('--fpsvis', 'unset');
            }
        });
    }
}
