import {debouncedReload, rootStyle} from '../util.js';
import '../../styles/component/players.css';

export default class MinimalUIPlayers {

    static cssPlayersHiddenWidth = '32px';
    static cssPlayersSmallFontSize = '12px';
    static cssPlayersSmallWidth = '175px';
    static cssPlayersStandardFontSize = 'inherit';
    static cssPlayersStandardWidth = '200px';

    static cssHotbarPlayerBottom = 5;
    static cssHotbarPlayerBottomAdj = 70;

    static initSettings() {
        game.settings.register('minimal-ui-personal', 'playerList', {
            name: game.i18n.localize("MinimalUI.PlayersBehaviourName"),
            hint: game.i18n.localize("MinimalUI.PlayersBehaviourHint"),
            scope: 'world',
            config: true,
            type: String,
            choices: {
                "default": game.i18n.localize("MinimalUI.SettingsAlwaysVisible"),
                "autohide": game.i18n.localize("MinimalUI.SettingsAutoHide"),
                "clicktoggle": game.i18n.localize("MinimalUI.SettingsClickToggle"),
                "hidden": game.i18n.localize("MinimalUI.SettingsHide")
            },
            default: "clicktoggle",
            onChange: debouncedReload
        });

        game.settings.register('minimal-ui-personal', 'playerListSize', {
            name: game.i18n.localize("MinimalUI.PlayersSizeName"),
            hint: game.i18n.localize("MinimalUI.PlayersSizeHint"),
            scope: 'world',
            config: true,
            type: String,
            choices: {
                "small": game.i18n.localize("MinimalUI.SettingsSmall"),
                "standard": game.i18n.localize("MinimalUI.SettingsStandard")
            },
            default: "standard",
            onChange: debouncedReload
        });

        if (game.modules.get('user-latency')?.active) {
            game.settings.register('minimal-ui-personal', 'playerShowPing', {
                name: game.i18n.localize("MinimalUI.PlayersShowPingName"),
                hint: game.i18n.localize("MinimalUI.PlayersShowPingHint"),
                scope: 'world',
                config: true,
                type: String,
                choices: {
                    "showPing": game.i18n.localize("MinimalUI.PlayersShowPing"),
                    "hidePing": game.i18n.localize("MinimalUI.PlayersHidePing"),
                },
                default: "hidePing",
                onChange: debouncedReload
            });
        }
    }

    static positionPlayers() {
        if (!(game.modules.get('sidebar-macros')?.active && game.settings.get('sidebar-macros', 'hideMacroHotbar'))) {
            let playerbot = 0;

            const isHotbarVisible = game.settings.get('minimal-ui-personal', 'hotbar') !== 'hidden';
            const isHotbarExtremeLeft = game.settings.get('minimal-ui-personal', 'hotbarPosition') === 'extremeLeft';

            if (isHotbarVisible && isHotbarExtremeLeft)
                playerbot = MinimalUIPlayers.cssHotbarPlayerBottomAdj;
            else
                playerbot = MinimalUIPlayers.cssHotbarPlayerBottom;

            // Compatibilidade com Window Controls na v13
            if (game.modules.get('window-controls')?.active &&
                game.settings.get('window-controls', 'organizedMinimize') === 'persistentTop')
                rootStyle.setProperty('--playerbot', (playerbot - 5) + 'px');
            else
                rootStyle.setProperty('--playerbot', playerbot + 'px');
        }
    }

    static initHooks() {

        Hooks.on('renderPlayerList', (app, html) => {
            const players = html; // Na v13, 'html' no renderPlayerList é o próprio elemento #players

            let plSize = game.settings.get('minimal-ui-personal', 'playerListSize');
            let plSetting = game.settings.get('minimal-ui-personal', 'playerList');
            
            // Ajuste para WebRTC na v13
            if (game.webrtc?.mode > 0) {
                if (plSetting !== 'hidden' && !ui.webrtc?.hidden) {
                    plSize = 'standard';
                    plSetting = 'default';
                }
            }

            switch (plSetting) {
                case 'default': {
                    players.css('transition', 'ease-out 0.5s');
                    if (plSize === 'small') {
                        rootStyle.setProperty('--playerfsize', MinimalUIPlayers.cssPlayersSmallFontSize);
                        rootStyle.setProperty('--players-width', MinimalUIPlayers.cssPlayersSmallWidth);
                        rootStyle.setProperty('--playerwidthhv', MinimalUIPlayers.cssPlayersSmallWidth);
                        rootStyle.setProperty('--topleft', game.system.id === 'sfrpg' ? '-184px' : '-175px');
                    } else {
                        rootStyle.setProperty('--playerfsize', MinimalUIPlayers.cssPlayersStandardFontSize);
                        rootStyle.setProperty('--playerfsizehv', MinimalUIPlayers.cssPlayersStandardFontSize);
                        rootStyle.setProperty('--players-width', MinimalUIPlayers.cssPlayersStandardWidth);
                        rootStyle.setProperty('--playerwidthhv', MinimalUIPlayers.cssPlayersStandardWidth);
                        rootStyle.setProperty('--topleft', game.system.id === 'sfrpg' ? '-209px' : '-200px');
                    }
                    rootStyle.setProperty('--playervis', 'visible');
                    rootStyle.setProperty('--playerslh', '20px');
                    break;
                }
                case 'autohide': case 'clicktoggle': {
                    if (plSize === 'small') {
                        rootStyle.setProperty('--playerfsizehv', MinimalUIPlayers.cssPlayersSmallFontSize);
                        rootStyle.setProperty('--playerwidthhv', MinimalUIPlayers.cssPlayersSmallWidth);
                    } else {
                        rootStyle.setProperty('--playerfsizehv', MinimalUIPlayers.cssPlayersStandardFontSize);
                        rootStyle.setProperty('--playerwidthhv', MinimalUIPlayers.cssPlayersStandardWidth);
                    }
                    rootStyle.setProperty('--playerfsize', '0');
                    rootStyle.setProperty('--playervis', 'visible');
                    rootStyle.setProperty('--playerslh', '2px');
                    rootStyle.setProperty('--playerh3w', '0%');

                    let playerWidthPixel = parseInt(MinimalUIPlayers.cssPlayersHiddenWidth);

                    // Compatibilidade User Latency
                    if (game.modules.get('user-latency')?.active) {
                        if (game.settings.get('minimal-ui-personal', 'playerShowPing') === "showPing") {
                            rootStyle.setProperty('--playerpingdisplay', 'initial');
                            rootStyle.setProperty('--playerslh', '20px');
                            playerWidthPixel += 36;
                        } else {
                            rootStyle.setProperty('--playerpingdisplay', 'none');
                            players.hover(
                                () => $(".pingLogger_pingSpan").show(),
                                () => $(".pingLogger_pingSpan").hide()
                            );
                        }
                    }

                    rootStyle.setProperty('--players-width', `${playerWidthPixel}px`);
                    
                    // Ajuste de TopLeft baseado no tamanho dos controles (também usando novo ID)
                    const ctrlSize = game.settings.get('minimal-ui-personal', 'controlsSize');
                    if (ctrlSize === 'small')
                        rootStyle.setProperty('--topleft', '-90px');
                    else
                        rootStyle.setProperty('--topleft', game.system.id === 'sfrpg' ? '-110px' : '-101px');

                    if (plSetting === 'autohide') {
                        players.hover(
                          () => {
                              players.css({'width': 'var(--playerwidthhv)', 'font-size': 'var(--playerfsizehv)', 'opacity': '100%'});
                              players.find('ol li.player').css('line-height', '20px');
                              if (plSize === 'small')
                                rootStyle.setProperty('--topleft', game.system.id === 'sfrpg' ? '-184px' : '-175px');
                              else
                                rootStyle.setProperty('--topleft', game.system.id === 'sfrpg' ? '-209px' : '-200px');
                          },
                          () => {
                              players.css({'width': '', 'font-size': 'var(--playerfsize)', 'opacity': 'var(--opacity)'});
                              players.find('ol li.player').css('line-height', '2px');
                              if (ctrlSize === 'small')
                                rootStyle.setProperty('--topleft', '-90px');
                              else
                                rootStyle.setProperty('--topleft', game.system.id === 'sfrpg' ? '-110px' : '-101px');
                          }
                        )
                    } else {
                        players.css('transition', 'ease-out 0.5s');
                        let state = 0;
                        players.find('h3').click(() => {
                            if (state === 0) {
                                players.css({'transition': '', 'width': 'var(--playerwidthhv)', 'font-size': 'var(--playerfsizehv)', 'opacity': '100%'});
                                players.find('ol li.player').css('line-height', '20px');
                                if (plSize === 'small')
                                    rootStyle.setProperty('--topleft', game.system.id === 'sfrpg' ? '-184px' : '-175px');
                                else
                                    rootStyle.setProperty('--topleft', game.system.id === 'sfrpg' ? '-209px' : '-200px');
                                state = 1;
                                setTimeout(() => { if (state === 1) players.css('transition', 'ease-out 0.5s')}, 100);
                            } else {
                                players.css({'transition': '', 'width': '', 'font-size': 'var(--playerfsize)', 'opacity': 'var(--opacity)'});
                                players.find('ol li.player').css('line-height', '2px');
                                if (ctrlSize === 'small')
                                    rootStyle.setProperty('--topleft', '-90px');
                                else
                                    rootStyle.setProperty('--topleft', game.system.id === 'sfrpg' ? '-110px' : '-101px');
                                state = 0;
                                setTimeout(() => { if (state === 0) players.css('transition', 'ease-out 0.5s')}, 100);
                            }
                        });
                        players.hover(
                          () => players.css('opacity', '100%'),
                          () => players.css('opacity', 'var(--opacity)')
                        )
                    }
                    break;
                }
                case 'hidden': {
                    rootStyle.setProperty('--playervis', 'hidden');
                    break;
                }
            }
            MinimalUIPlayers.positionPlayers();
        });
    }
}
