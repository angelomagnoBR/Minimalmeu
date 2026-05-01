export default class MinimalUIPatch {

    static initSettings() {
        // Reservado para futuras correções de compatibilidade via configurações
    }

    static initHooks() {
        
        // Gerencia a troca de abas na barra lateral
        Hooks.on('changeSidebarTab', function (app) {
            // Na v13, Object.values(ui.windows) ainda funciona para janelas v1, 
            // mas estamos adicionando verificações para garantir que o alvo seja encontrado.
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
            // Patch específico para o Chat Log
            // Na v13, o seletor JQuery deve ser usado com cautela; usamos o html.find do ui.sidebar se disponível
            const sidebarElement = ui.sidebar.element;
            const chatTab = sidebarElement.find('[data-tab="chat"]');
            
            if (chatTab?.length) {
                // Clique simples para trazer pop-out ao topo se colapsado
                chatTab.on('click', () => {
                    if (ui.sidebar._collapsed && ui.chat._popout) {
                        ui.chat._popout.bringToTop();
                    }
                });
                
                // Clique direito (contextmenu) para gerenciar o pop-out
                chatTab.on('contextmenu', () => {
                    if (ui.chat._popout) {
                        ui.chat._popout.bringToTop();
                    }
                });
            }

            // Patch para maximizar qualquer aba minimizada ao clicar com botão direito nos ícones da barra lateral
            $("#sidebar-tabs > a").on('contextmenu', (e) => {
                const tabName = $(e.currentTarget).attr('data-tab');
                const tab = ui[tabName];
                if (tab && tab._popout && tab._popout._minimized) {
                    tab._popout.maximize();
                }
            });
            
            // Correção v13: Impede que o menu de contexto nativo do navegador apareça nos ícones da sidebar
            $("#sidebar-tabs > a").on('contextmenu', (e) => e.preventDefault());
        });
    }

}
