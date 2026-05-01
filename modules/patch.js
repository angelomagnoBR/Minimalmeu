import {rootStyle} from './util.js';

export default class MinimalUIPatch {

    static initSettings() {
        // Reservado para futuras correções de compatibilidade via configurações
    }

    static initHooks() {
        
        // Gerencia a troca de abas na barra lateral para ApplicationV2 (v13)
        Hooks.on('changeSidebarTab', function (app) {
            // Na v13, buscamos a janela correspondente à aba selecionada
            const target = Object.values(ui.windows).find(a => a.tabName === app.tabName);
            
            // Se a barra estiver colapsada, traz a janela pop-out para frente ou maximiza
            if (ui.sidebar._collapsed && target) {
                if (target._minimized) {
                    target.maximize();
                } else if (target.popOut) {
                    target.bringToTop();
                }
            }
        });

        // Garante que abas renderizadas em pop-out fiquem no topo
        Hooks.on('renderSidebarTab', function (app) {
            if (app?.popOut && typeof app.bringToTop === 'function') {
                app.bringToTop();
            }
        });

        Hooks.on('ready', function() {
            // Patch específico para o Chat Log usando seletores compatíveis com v13
            const sidebarElement = ui.sidebar.element;
            const chatTab = sidebarElement.find('[data-tab="chat"]');
            
            if (chatTab?.length) {
                // Clique simples para trazer pop-out ao topo se a sidebar estiver colapsada
                chatTab.on('click', () => {
                    if (ui.sidebar._collapsed && ui.chat._popout) {
                        ui.chat._popout.bringToTop();
                    }
                });
                
                // Clique direito (contextmenu) para gerenciar o pop-out
                chatTab.on('contextmenu', (e) => {
                    e.preventDefault(); // Impede o menu nativo do navegador
                    if (ui.chat._popout) {
                        ui.chat._popout.bringToTop();
                    }
                });
            }

            // Patch para maximizar abas minimizadas via botão direito nos ícones
            const sidebarIcons = $("#sidebar-tabs > a");
            
            sidebarIcons.on('contextmenu', (e) => {
                e.preventDefault(); // Bloqueia o menu de contexto nativo
                const tabName = $(e.currentTarget).attr('data-tab');
                const tab = ui[tabName];
                if (tab && tab._popout && tab._popout._minimized) {
                    tab._popout.maximize();
                }
            });
        });
    } // Fecha initHooks
} // Fecha a Classe
