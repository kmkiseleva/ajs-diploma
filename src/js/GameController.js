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

    // this.userPositions = [];
    // this.computerPositions = [];
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

    const userTeam = generateTeam(new Team().userTeam, 1, 2);
    const computerTeam = generateTeam(new Team().computerTeam, 1, 2);
    // this.setPositions(userTeam, computerTeam);

    this.players = [...userTeam, ...computerTeam];
    this.gamePlay.redrawPositions(this.players);
  }

  // setPositions(userTeam, computerTeam) {
  //   for (let char of userTeam) {
  //     this.userPositions.push(new PositionedCharacter(char, 0));
  //   }

  //   for (let char of computerTeam) {
  //     this.computerPositions.push(new PositionedCharacter(char, 0));
  //   }
  // }

  //Events
  clickCellsListener() {
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  enterOnCellsListener() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
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

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }

  onNewGame() {}

  onSaveGame() {}

  onLoadGame() {}
}
