import {rootStyle} from '../util.js';
import '../../styles/component/sidebar.css';

export default class MinimalUISidebar {

    static initSettings() {
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
        // Hook disparado na renderização da Sidebar
        Hooks.on('renderSidebar', (app, html) => {
            // Compatibilidade v13: html pode vir como HTMLElement ou jQuery
            const sidebarTabs = html instanceof HTMLElement ? $(html).find("#sidebar-tabs") : html.find("#sidebar-tabs");
            
            if (sidebarTabs.length) {
                const currentHeight = sidebarTabs.css('--sidebar-tab-height') || "32px";
                const newHeight = parseInt(currentHeight) / 1.25;
                sidebarTabs.css('--sidebar-tab-height', newHeight + 'px');
            }

            const behaviour = game.settings.get('minimal-ui-personal', 'rightcontrolsBehaviour');

            // Timeout de segurança para garantir que o Foundry terminou o ciclo de renderização
            if (behaviour === 'collapsed') {
                setTimeout(() => {
                    if (ui.sidebar && !ui.sidebar._collapsed) {
                        ui.sidebar.collapse();
                    }
                }, 100);
            }
            
            rootStyle.setProperty('--controlsvis', 'visible');
            rootStyle.setProperty('--fpsvis', 'unset');
        });

        // Ajuste de elementos flutuantes quando a barra colapsa
        Hooks.on('collapseSidebar', function(sidebar, isCollapsing) {
            if (isCollapsing) {
                rootStyle.setProperty('--fpsposx', '-5px');
            } else {
                rootStyle.setProperty('--fpsposx', '300px');
            }
            rootStyle.setProperty('--fpsvis', 'unset');
        });
    }
}
