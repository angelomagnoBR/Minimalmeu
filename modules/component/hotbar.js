import {debouncedReload, rootStyle} from '../util.js';
import '../../styles/component/hotbar.css';
import MinimalUIPlayers from "./players.js"; // Adicionado .js para consistência

export default class MinimalUIHotbar {

    static hotbarLocked = false;

    static cssHotbarHidden = '-50px';
    static cssHotbarAutoHideHeight = '-5px';
    static cssHotbarAutoHideHeightWinTop = '1px';

    static cssHotbarLeftControlsLineHeight = '24px';
    static cssHotbarRightControlsLineHeight = '12px';
    static cssHotbarRightControlsLineHeightDnDUi = '10px';
    static cssHotbarControlsAutoHideHeight = '100%';
    static cssHotbarAutoHideShadow = '-1px';
    static cssHotbarControlsMargin = '0px';
    static cssHotbarCustomHotbarCompatHover = '10px';

    static htmlHotbarLockButton =
        `
        <a class="minui-lock" id="bar-lock">
          <i class="fas fa-lock-open"></i>
        </a>
        `

    static lockHotbar(unlock) {
        // Ignora se módulos de expansão estiverem ativos ou vídeo no rodapé
        if ((game.modules.get("custom-hotbar")?.active) || (game.modules.get('monks-hotbar-expansion')?.active) || (game.webrtc.mode > 0 && game.webrtc.settings.client.dockPosition === 'bottom'))
            return;
        
        const barLock = $("#bar-lock > i");
        if (MinimalUIHotbar.hotbarLocked && unlock) {
            rootStyle.setProperty('--hotbarypos', MinimalUIHotbar.cssHotbarHidden);
            barLock.removeClass("fa-lock").addClass("fa-lock-open");
            MinimalUIHotbar.hotbarLocked = false;
        } else if (game.settings.get('minimal-ui-personal', 'hotbar') === 'autohide') {
            rootStyle.setProperty('--hotbarypos', MinimalUIHotbar.cssHotbarAutoHideHeight);
            barLock.removeClass("fa-lock-open").addClass("fa-lock");
            MinimalUIHotbar.hotbarLocked = true;
        }
    }

    static positionHotbar() {
        let availableWidth = canvas.app?.screen.width;
        if (!availableWidth) return;
        
        let webrtcAdjust = 0;
        let webrtcVAdjust = 0;

        if (game.webrtc.mode > 0 && !ui.webrtc.element.hasClass('hidden')) {
            if (game.webrtc.settings.client.dockPosition === 'left')
                webrtcAdjust = (ui.webrtc.hidden ? 0 : ui.webrtc.position.width);
            if (game.webrtc.settings.client.dockPosition === 'bottom') {
                webrtcVAdjust = 187;
            }
        }

        // Corrigido erro lógico de parênteses no settings.get
        const isAutoHide = game.settings.get('minimal-ui-personal', 'hotbar') === 'autohide';
        const autoHideBlocked = (game.webrtc.mode > 0 && game.webrtc.settings.client.dockPosition === 'bottom') ||
            (game.modules.get('window-controls')?.active && game.settings.get('window-controls', 'organizedMinimize') === 'persistentBottom');

        const autoHideOrLock = !isAutoHide || autoHideBlocked;

        if (game.modules.get('window-controls')?.active && autoHideOrLock) {
            const winMode = game.settings.get('window-controls', 'organizedMinimize');
            if (winMode === 'persistentBottom')
                rootStyle.setProperty('--hotbarypos', webrtcVAdjust + 40 + 'px');
            else if (winMode === 'persistentTop')
                rootStyle.setProperty('--hotbarypos', webrtcVAdjust + 5 + 'px');
            else
                rootStyle.setProperty('--hotbarypos', webrtcVAdjust + 'px');
        }

        const posMode = game.settings.get('minimal-ui-personal', 'hotbarPosition');
        switch (posMode) {
            case 'default': {
                rootStyle.setProperty('--hotbarxpos', (330 + webrtcAdjust)+'px');
                break;
            }
            case 'extremeLeft': {
                if (!(game.modules.get("custom-hotbar")?.active) && availableWidth >= 1200)
                    rootStyle.setProperty('--hotbarxpos', 8 + webrtcAdjust + 'px');
                break;
            }
            case 'left': {
                rootStyle.setProperty('--hotbarxpos', ((availableWidth / 2.5) - (availableWidth / 9) - (availableWidth / 9) + webrtcAdjust) + 'px');
                break;
            }
            case 'center': {
                rootStyle.setProperty('--hotbarxpos', ((availableWidth / 2.5) - (availableWidth / 9) + webrtcAdjust) + 'px');
                break;
            }
            case 'right': {
                rootStyle.setProperty('--hotbarxpos', ((availableWidth / 2.5) + webrtcAdjust) + 'px');
                break;
            }
            case 'manual': {
                rootStyle.setProperty('--hotbarxpos', (parseInt(game.settings.get('minimal-ui-personal', 'hotbarPixelPosition')) + webrtcAdjust) + 'px');
                break;
            }
        }
        MinimalUIPlayers.positionPlayers();
    }

    static configureHotbar() {
        const autoHideBlocked = (game.webrtc.mode > 0 && game.webrtc.settings.client.dockPosition === 'bottom') ||
            (game.modules.get('window-controls')?.active && game.settings.get('window-controls', 'organizedMinimize') === 'persistentBottom');
        
        if (game.settings.get('minimal-ui-personal', 'hotbar') === 'autohide' && !autoHideBlocked) {
            if (!(game.modules.get("custom-hotbar")?.active || game.modules.get('monks-hotbar-expansion')?.active)) {
                rootStyle.setProperty('--hotbarypos', MinimalUIHotbar.cssHotbarHidden);
                rootStyle.setProperty('--hotbarlh1', MinimalUIHotbar.cssHotbarLeftControlsLineHeight);
                rootStyle.setProperty('--hotbarlh2', MinimalUIHotbar.cssHotbarRightControlsLineHeight);
                
                if (game.modules.get('dnd-ui')?.active) {
                    rootStyle.setProperty('--hotbarlh2', MinimalUIHotbar.cssHotbarRightControlsLineHeightDnDUi);
                }
                
                rootStyle.setProperty('--hotbarmg', MinimalUIHotbar.cssHotbarControlsMargin);
                rootStyle.setProperty('--hotbarhh', MinimalUIHotbar.cssHotbarControlsAutoHideHeight);
                
                const winTop = game.modules.get('window-controls')?.active && game.settings.get('window-controls', 'organizedMinimize') === 'persistentTop';
                rootStyle.setProperty('--hotbarhv', winTop ? MinimalUIHotbar.cssHotbarAutoHideHeightWinTop : MinimalUIHotbar.cssHotbarAutoHideHeight);
                
                rootStyle.setProperty('--hotbarshp', MinimalUIHotbar.cssHotbarAutoHideShadow);

                // Evita duplicação do botão de trava ao re-renderizar
                if ($("#bar-lock").length === 0) {
                    $("#hotbar-directory-controls").append(MinimalUIHotbar.htmlHotbarLockButton);
                    $("#macro-directory").on('click', () => MinimalUIHotbar.lockHotbar(false));
                    $("#bar-lock").on('click', () => MinimalUIHotbar.lockHotbar(true));
                    $(".page-control").on('click', () => MinimalUIHotbar.lockHotbar(false));
                }

                if (MinimalUIHotbar.hotbarLocked) {
                    MinimalUIHotbar.lockHotbar(false);
                }
                $("#bar-toggle").remove();
            }
        }
    }

    static initSettings() {
        game.settings.register('minimal-ui-personal', 'hotbar', {
            name: game.i18n.localize("MinimalUI.HotbarStyleName"),
            hint: game.i18n.localize("MinimalUI.HotbarStyleHint"),
            scope: 'world',
            config: true,
            type: String,
            choices: {
                "shown": game.i18n.localize("MinimalUI.SettingsAlwaysVisible"),
                "autohide": game.i18n.localize("MinimalUI.SettingsAutoHide"),
                "collapsed": game.i18n.localize("MinimalUI.SettingsCollapsed"),
                "onlygm": game.i18n.localize("MinimalUI.SettingsOnlyGM"),
                "hidden": game.i18n.localize("MinimalUI.SettingsHide")
            },
            default: "collapsed",
            onChange: debouncedReload
        });

        game.settings.register('minimal-ui-personal', 'hotbarPosition', {
            name: game.i18n.localize("MinimalUI.HotbarPositionName"),
            hint: game.i18n.localize("MinimalUI.HotbarPositionHint"),
            scope: 'world',
            config: true,
            type: String,
            choices: {
                "default": game.i18n.localize("MinimalUI.HotbarPositionMaxLeft"),
                "extremeLeft": game.i18n.localize("MinimalUI.HotbarPositionExtremeLeft"),
                "left": game.i18n.localize("MinimalUI.HotbarPositionCenterLeft"),
                "center": game.i18n.localize("MinimalUI.HotbarPositionCenter"),
                "right": game.i18n.localize("MinimalUI.HotbarPositionCenterRight"),
                "manual": game.i18n.localize("MinimalUI.HotbarPositionManual")
            },
            default: "extremeLeft",
            onChange: MinimalUIHotbar.positionHotbar
        });

        game.settings.register('minimal-ui-personal', 'hotbarPixelPosition', {
            name: game.i18n.localize("MinimalUI.HotbarPPositionName"),
            hint: game.i18n.localize("MinimalUI.HotbarPPositionHint"),
            scope: 'world',
            config: true,
            type: String,
            default: "400",
            onChange: MinimalUIHotbar.positionHotbar
        });
    }

    static initHooks() {
        Hooks.on('ready', () => MinimalUIHotbar.positionHotbar());

        Hooks.on('renderHotbar', () => {
            MinimalUIHotbar.configureHotbar();
            if (game.modules.get('custom-hotbar')?.active) {
                rootStyle.setProperty('--hotbarhv', MinimalUIHotbar.cssHotbarCustomHotbarCompatHover);
                $("#hotbar").css('margin-bottom', '-5px');
            }
            if (game.modules.get('monks-hotbar-expansion')?.active) {
                $("#hotbar").css('position', 'fixed');
            }
        });

        Hooks.on('rtcSettingsChanged', () => MinimalUIHotbar.positionHotbar());

        Hooks.once('renderHotbar', () => {
            const hotbarSetting = game.settings.get('minimal-ui-personal', 'hotbar');
            if (hotbarSetting === 'collapsed' && ui.hotbar)
                ui.hotbar.collapse();
            else if (['onlygm', 'hidden'].includes(hotbarSetting)) {
                if (hotbarSetting === 'hidden' || !game.user.isGM)
                    rootStyle.setProperty('--hotbarvis', 'hidden');
            }
        });

        Hooks.once('renderCustomHotbar', () => {
            if (game.modules.get("custom-hotbar")?.active && game.settings.get('minimal-ui-personal', 'hotbar') === 'collapsed') {
                ui.customHotbar?.collapse();
            }
        });

        Hooks.on('renderCompendium', (compendium) => {
            if (compendium.metadata.type === 'Macro')
                MinimalUIHotbar.lockHotbar(false);
        });
    }
}
