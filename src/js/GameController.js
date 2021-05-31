import GamePlay from "./GamePlay";
import GameState from "./GameState";
import cursors from "./cursors";
import themes from "./themes";
import { characterGenerator, generateTeam } from "./generators";
import Character from "./Character";
import PositionedCharacter from "./PositionedCharacter";
import Team from "./Team";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.startGame();

    // TODO: add event listeners to gamePlay events
    this.clickCellsListener();
    this.enterOnCellsListener();
    this.leaveCellsListener();

    // TODO: load saved stated from stateService
    this.newGameListener();
    this.saveGameListener();
    this.loadGameListener();
  }

  startGame() {
    this.scores = 0;
    this.currentLevel = 1;
    this.gamePlay.drawUi(themes[this.currentLevel - 1]);

    //создание команды
    const userTeam = generateTeam(new Team().userTeam, 1, 2);
    const computerTeam = generateTeam(new Team().computerTeam, 1, 2);

    this.userTeamWithPositions = [];
    this.computerTeamWithPositions = [];

    this.userPositions = [
      0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57,
    ];
    this.computerPositions = [
      6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63,
    ];

    this.setPositions(userTeam, computerTeam);
    this.gamePlay.redrawPositions([
      ...this.userTeamWithPositions,
      ...this.computerTeamWithPositions,
    ]);

    this.players = [
      ...this.userTeamWithPositions,
      ...this.computerTeamWithPositions,
    ];
  }

  setPositions(userTeam, computerTeam) {
    this.userTeamWithPositions.push(
      new PositionedCharacter(
        userTeam[0],
        this.userPositions[
          Math.floor(Math.random() * this.userPositions.length)
        ]
      )
    );
    this.userTeamWithPositions.push(
      new PositionedCharacter(
        userTeam[1],
        this.userPositions[
          Math.floor(Math.random() * this.userPositions.length)
        ]
      )
    );

    this.computerTeamWithPositions.push(
      new PositionedCharacter(
        computerTeam[0],
        this.computerPositions[
          Math.floor(Math.random() * this.computerPositions.length)
        ]
      )
    );
    this.computerTeamWithPositions.push(
      new PositionedCharacter(
        computerTeam[1],
        this.computerPositions[
          Math.floor(Math.random() * this.computerPositions.length)
        ]
      )
    );
  }

  //Events
  enterOnCellsListener() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
  }

  clickCellsListener() {
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  leaveCellsListener() {
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }

  newGameListener() {
    this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
  }

  saveGameListener() {
    this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this));
  }

  loadGameListener() {
    this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));
  }

  // ========================
  onCellEnter(index) {
    // TODO: react to mouse enter
    const currentChar = this.players.find((char) => char.position === index);

    if (currentChar) {
      const { level, attack, defence, health } = currentChar.character;
      this.gamePlay.showCellTooltip(
        `🎖${level} ⚔${attack} 🛡${defence} ❤${health}`,
        index
      );
    }
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }

  onNewGame() {}

  onSaveGame() {}

  onLoadGame() {}
}
