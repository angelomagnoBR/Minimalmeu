import {debouncedReload, rootStyle} from '../util.js';
import '../../styles/component/controls.css';

export default class MinimalUIControls {

    static delayedProcessing = false;

    static cssControlsStandardWidth = '36px';
    static cssControlsStandardHeight = '36px';
    static cssControlsStandardLineHeight = '36px';
    static cssControlsStandardFontSize = '24px';

    static cssControlsSmallWidth = '25px';
    static cssControlsSmallHeight = '24px';
    static cssControlsSmallLineHeight = '25px';
    static cssControlsSmallFontSize = '15px';

    static positionControls() {
        // Importante: Todos os GETS devem usar o novo ID para não retornarem 'undefined'
        const logoSettings = game.settings.get('minimal-ui-personal', 'foundryLogoSize');
        const navSettings = game.settings.get('minimal-ui-personal', 'sceneNavigation');
        const navSizeSettings = game.settings.get('minimal-ui-personal', 'sceneNavigationSize');
        
        if (logoSettings === 'hidden' && navSettings === 'hidden') {
            rootStyle.setProperty('--controlstop', '-65px');
        } else if (navSizeSettings === 'big') {
            rootStyle.setProperty('--controlstop', '115px');
        } else if (navSizeSettings === 'standard') {
            rootStyle.setProperty('--controlstop', '100px');
        } else if (logoSettings !== 'standard') {
            rootStyle.setProperty('--controlstop', '75px');
        }
    }

    static showSubControls() {
        if (game.settings.get('minimal-ui-personal', 'controlsSubHide') === 'autohide') {
            rootStyle.setProperty('--controlssubop', '0%');
        } else if (game.settings.get('minimal-ui-personal', 'controlsSubHide') === 'autohide-plus') {
            rootStyle.setProperty('--controlssubdisna', 'none');
            rootStyle.setProperty('--controlssubopna', '0%');
        }
    }

    static sizeControls() {
        if (game.settings.get('minimal-ui-personal', 'controlsSize') === 'small') {
            rootStyle.setProperty('--controlsw', MinimalUIControls.cssControlsSmallWidth);
            rootStyle.setProperty('--controlsh', MinimalUIControls.cssControlsSmallHeight);
            rootStyle.setProperty('--controlslh', MinimalUIControls.cssControlsSmallLineHeight);
            rootStyle.setProperty('--controlsfs', MinimalUIControls.cssControlsSmallFontSize);
        } else {
            rootStyle.setProperty('--controlsw', MinimalUIControls.cssControlsStandardWidth);
            rootStyle.setProperty('--controlsh', MinimalUIControls.cssControlsStandardHeight);
            rootStyle.setProperty('--controlslh', MinimalUIControls.cssControlsStandardLineHeight);
            rootStyle.setProperty('--controlsfs', MinimalUIControls.cssControlsStandardFontSize);
        }
    }

    static initSettings() {
        game.settings.register('minimal-ui-personal', 'controlsSize', {
            name: game.i18n.localize("MinimalUI.ControlsSizeName"),
            hint: game.i18n.localize("MinimalUI.ControlsSizeHint"),
            scope: 'world',
            config: true,
            type: String,
            choices: {
                "small": game.i18n.localize("MinimalUI.SettingsSmall"),
                "standard": game.i18n.localize("MinimalUI.SettingsStandard")
            },
            default: "small",
            onChange: MinimalUIControls.sizeControls
        });
        game.settings.register('minimal-ui-personal', 'controlsSubHide', {
            name: game.i18n.localize("MinimalUI.ControlsSubHideName"),
            hint: game.i18n.localize("MinimalUI.ControlsSubHideHint"),
            scope: 'world',
            config: true,
            type: String,
            choices: {
                "autohide": game.i18n.localize("MinimalUI.SettingsAutoHide"),
                "autohide-plus": game.i18n.localize("MinimalUI.SettingsAutoHidePlus"),
                "visible": game.i18n.localize("MinimalUI.SettingsAlwaysVisible")
            },
            default: "visible",
            onChange: debouncedReload
        });
    };

    static initHooks() {
        // Na v13, renderSceneControls é disparado sempre que os botões da esquerda mudam
        Hooks.on('renderSceneControls', function (controls, html) {
            MinimalUIControls.positionControls();
            MinimalUIControls.showSubControls();
            MinimalUIControls.sizeControls();

            // Lógica de Hover/Click para sub-controles
            function controlsSubHoverRefresh() {
                setTimeout(() => {
                    const activeElement = html.find('#controls');
                    if (activeElement.length && !activeElement.is(':hover')) {
                        rootStyle.setProperty('--controlssubdisna', 'none');
                        MinimalUIControls.delayedProcessing = false;
                    } else controlsSubHoverRefresh();
                }, 6000)
            }

            function controlsSubClickRefresh() {
                setTimeout(() => {
                    if (game.settings.get('minimal-ui-personal', 'controlsSubHide') === 'autohide')
                        rootStyle.setProperty('--controlssubop', '0%');
                    else if (game.settings.get('minimal-ui-personal', 'controlsSubHide') === 'autohide-plus') {
                        controlsSubHoverRefresh();
                    }
                    // Adicionando fallback para evitar erro de leitura se a transparência não estiver definida
                    const transparency = game.settings.get("minimal-ui-personal", "transparencyPercentage") || 100;
                    rootStyle.setProperty('--opacitycontrols', transparency + '%');
                }, 3000)
            }

            if (['autohide', 'autohide-plus'].includes(game.settings.get('minimal-ui-personal', 'controlsSubHide'))) {
                html.find('li.control-tool').click(() => {
                    rootStyle.setProperty('--controlssubop', '100%');
                    rootStyle.setProperty('--controlssubopna', '100%');
                    rootStyle.setProperty('--opacitycontrols', '100%');
                    rootStyle.setProperty('--controlssubdisna', 'block');
                    controlsSubClickRefresh();
                });

                if (game.settings.get('minimal-ui-personal', 'controlsSubHide') === 'autohide-plus') {
                    html.find('li.control-tool').hover(() => {
                        if (MinimalUIControls.delayedProcessing) return;
                        MinimalUIControls.delayedProcessing = true;
                        rootStyle.setProperty('--controlssubdisna', 'block');
                        controlsSubHoverRefresh();
                    });
                }
            }
        });
    };
}
