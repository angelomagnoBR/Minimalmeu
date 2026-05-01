import {debouncedReload, rootStyle} from '../util.js';


export default class MinimalUILogo {

    static hiddenInterface = false;

    static hideAll() {
        // Na v13, o logo pode demorar a ser inserido no DOM; html.find no hook é mais seguro, 
        // mas manteremos o seletor jQuery direto com uma verificação.
        $('#logo').click(_ => {
            let alsoChat;
            switch (game.settings.get('minimal-ui-personal', 'foundryLogoBehaviour')) {
                case 'toggleAll': {
                    alsoChat = true;
                    break;
                }
                case 'toggleButChat': {
                    alsoChat = false;
                    break;
                }
            }
            
            if (!MinimalUILogo.hiddenInterface) {
                if (alsoChat) { $('#sidebar').hide(); }
                $('#navigation').hide();
                $('#controls').hide();
                $('#players').hide();
                $('#hotbar').hide();
                // Adicionado suporte para esconder as novas janelas v13 se necessário
                $('.app.v2').fadeOut('fast'); 
                MinimalUILogo.hiddenInterface = true;
            } else {
                if (alsoChat) { $('#sidebar').show(); }
                $('#navigation').show();
                $('#controls').show();
                $('#players').show();
                $('#hotbar').show();
                $('.app.v2').fadeIn('fast');
                MinimalUILogo.hiddenInterface = false;
            }
        });
    }

    static updateImageSrc(srcimg) {
        const logoSetting = game.settings.get('minimal-ui-personal', 'foundryLogoSize');
        if (!game.modules.get('mytab')?.active && logoSetting !== 'hidden') {
            $("#logo")
                .attr('src', srcimg)
                .on('error', function () {
                    if (game.user.isGM)
                        ui.notifications.warn(
                            "Minimal UI (v13 Fix): Sua imagem de Logo não foi encontrada. Restaurando padrão do Foundry."
                        );
                    MinimalUILogo.updateImageSrc("icons/fvtt.png")
                });
        }
    }

    static initSettings() {

        game.settings.register('minimal-ui-personal', 'foundryLogoSize', {
            name: game.i18n.localize("MinimalUI.LogoStyleName"),
            hint: game.i18n.localize("MinimalUI.LogoStyleHint"),
            scope: 'world',
            config: true,
            type: String,
            choices: {
                "hidden": game.i18n.localize("MinimalUI.SettingsHide"),
                "standard": game.i18n.localize("MinimalUI.SettingsStandard")
            },
            default: "hidden",
            onChange: debouncedReload
        });

        game.settings.register('minimal-ui-personal', 'foundryLogoBehaviour', {
            name: game.i18n.localize("MinimalUI.LogoBehaviourName"),
            hint: game.i18n.localize("MinimalUI.LogoBehaviourHint"),
            scope: 'world',
            config: true,
            type: String,
            choices: {
                "toggleAll": game.i18n.localize("MinimalUI.LogoBehaviourToggle"),
                "toggleButChat": game.i18n.localize("MinimalUI.LogoBehaviourToggleNoChat")
            },
            default: "toggleButChat"
        });

        game.settings.register('minimal-ui-personal', 'foundryLogoImage', {
            name: game.i18n.localize("MinimalUI.LogoImageName"),
            hint: game.i18n.localize("MinimalUI.LogoImageHint"),
            scope: 'world',
            config: true,
            type: String,
            filePicker: 'image', // Alterado de 'file' para 'image' para melhor filtro na v13
            default: "icons/fvtt.png",
            onChange: _ => {
                MinimalUILogo.updateImageSrc(game.settings.get('minimal-ui-personal', 'foundryLogoImage'));
            }
        });
    }

    static initHooks() {

        // Hook renderSceneNavigation ainda é o melhor momento para o ajuste inicial do Logo
        Hooks.once('renderSceneNavigation', async function () {
            MinimalUILogo.updateImageSrc(game.settings.get('minimal-ui-personal', 'foundryLogoImage'));
        });

        Hooks.once('ready', async function () {

            if (game.settings.get('minimal-ui-personal', 'foundryLogoSize') !== 'hidden') {
                MinimalUILogo.hideAll();
            }

            if (game.settings.get('minimal-ui-personal', 'foundryLogoSize') === 'standard') {
                rootStyle.setProperty('--logovis', 'visible');
            }

        });

    }

}
