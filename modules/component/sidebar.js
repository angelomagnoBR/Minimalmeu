import {rootStyle} from '../util.js';
import '../../styles/component/sidebar.css';

export default class MinimalUISidebar {

    static initSettings() {
        // Usando o ID 'minimal-ui-personal' conforme definido no seu module.json
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
            default: "shown" // Forçado para 'shown' para evitar que a barra suma ao instalar
        });
    }

    static initHooks() {
        // renderSidebar é disparado quando a barra lateral é desenhada na v13
        Hooks.on('renderSidebar', (app, html) => {
            // Na v13, 'html' pode ser um objeto jQuery ou HTMLElement; o método find é seguro aqui
            const sidebarElem = html.find("#sidebar-tabs"); 
            
            if (sidebarElem.length) {
                const currentHeight = sidebarElem.css('--sidebar-tab-height') || "32px";
                const newHeight = parseInt(currentHeight) / 1.25;
                sidebarElem.css('--sidebar-tab-height', newHeight + 'px');
            }

            const behaviour = game.settings.get('minimal-ui-personal', 'rightcontrolsBehaviour');

            if (behaviour === 'collapsed') {
                // Executa o colapso apenas se a barra já não estiver colapsada
                if (ui.sidebar && !ui.sidebar._collapsed) {
                    ui.sidebar.collapse();
                }
            }
            
            // Garante que os controles fiquem visíveis mesmo se houver delay na renderização
            rootStyle.setProperty('--controlsvis', 'visible');
            rootStyle.setProperty('--fpsvis', 'unset');
        });

        Hooks.on('collapseSidebar', function(sidebar, isCollapsing) {
            // Ajuste dinâmico de posição para evitar que elementos fiquem sobrepostos na v13
            if (isCollapsing) {
                rootStyle.setProperty('--fpsposx', '-5px');
            } else {
                // 300px é a largura padrão, mas pode variar conforme o sistema
                rootStyle.setProperty('--fpsposx', '300px');
            }
            rootStyle.setProperty('--fpsvis', 'unset');
        });
    }
}
