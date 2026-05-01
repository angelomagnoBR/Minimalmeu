import {rootStyle} from '../util.js';
import '../../styles/customization/theme.css';

export default class MinimalUITheme {

    static initSettings() {
        // Atualizado para usar o ID 'minimal-ui-personal'
        new window.Ardittristan.ColorSetting("minimal-ui-personal", "borderColor", {
            name: game.i18n.localize("MinimalUI.BorderColorName"),
            hint: game.i18n.localize("MinimalUI.BorderColorHint"),
            label: game.i18n.localize("MinimalUI.ColorPicker"),
            scope: "world",
            restricted: true,
            defaultColor: "#00000080",
            onChange: _ => {
                const color = game.settings.get('minimal-ui-personal', 'borderColor');
                rootStyle.setProperty('--bordercolor', color);
                if (game.modules.get('minimal-window-controls')?.active) {
                    rootStyle.setProperty('--wcbordercolor', color);
                }
                if (game.modules.get('scene-preview')?.active) {
                    rootStyle.setProperty('--spbordercolor', color);
                }
            }
        });

        new window.Ardittristan.ColorSetting("minimal-ui-personal", "shadowColor", {
            name: game.i18n.localize("MinimalUI.ShadowColorName"),
            hint: game.i18n.localize("MinimalUI.ShadowColorHint"),
            label: game.i18n.localize("MinimalUI.ColorPicker"),
            scope: "world",
            restricted: true,
            defaultColor: "#7c7c7c40",
            type: String,
            onChange: _ => {
                const sColor = game.settings.get('minimal-ui-personal', 'shadowColor');
                rootStyle.setProperty('--shadowcolor', sColor);
                // Corrigido: agora aplica a cor da sombra correta para módulos parceiros
                if (game.modules.get('minimal-window-controls')?.active) {
                    rootStyle.setProperty('--wcshadowcolor', sColor);
                }
                if (game.modules.get('scene-preview')?.active) {
                    rootStyle.setProperty('--spshadowcolor', sColor);
                }
            }
        });

        game.settings.register("minimal-ui-personal", "shadowStrength", {
            name: game.i18n.localize("MinimalUI.ShadowStrengthName"),
            hint: game.i18n.localize("MinimalUI.ShadowStrengthHint"),
            scope: "world",
            config: true,
            default: "5",
            type: String,
            onChange: _ => {
                const strength = game.settings.get('minimal-ui-personal', 'shadowStrength') + 'px';
                rootStyle.setProperty('--shadowstrength', strength);
                if (game.modules.get('minimal-window-controls')?.active) {
                    rootStyle.setProperty('--wcshadowstrength', strength);
                }
                if (game.modules.get('scene-preview')?.active) {
                    rootStyle.setProperty('--spshadowstrength', strength);
                }
            }
        });

        game.settings.register("minimal-ui-personal", "transparencyPercentage", {
            name: game.i18n.localize("MinimalUI.TransparencyPercentageName"),
            hint: game.i18n.localize("MinimalUI.TransparencyPercentageHint"),
            scope: "world",
            config: true,
            default: 100,
            type: Number,
            onChange: _ => {
                const transparency = game.settings.get('minimal-ui-personal', 'transparencyPercentage');
                if (transparency >= 0 && transparency <= 100) {
                    const op = transparency.toString() + '%';
                    rootStyle.setProperty('--opacity', op);
                    rootStyle.setProperty('--opacitycontrols', op);
                }
            }
        });
    }

    static initHooks() {
        Hooks.once('renderSceneControls', async function () {
            // Sincronização inicial ao carregar o mundo
            rootStyle.setProperty('--bordercolor', game.settings.get('minimal-ui-personal', 'borderColor'));
            rootStyle.setProperty('--shadowcolor', game.settings.get('minimal-ui-personal', 'shadowColor'));
            rootStyle.setProperty('--shadowstrength', game.settings.get('minimal-ui-personal', 'shadowStrength') + 'px');
            
            const transparency = game.settings.get('minimal-ui-personal', 'transparencyPercentage');
            if (transparency >= 0 && transparency <= 100) {
                const op = transparency.toString() + '%';
                rootStyle.setProperty('--opacity', op);
                rootStyle.setProperty('--opacitycontrols', op);
            }
        })
    }
}
