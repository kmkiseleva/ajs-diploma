import GamePlay from "./GamePlay";
import GameState from "./GameState";
import cursors from "./cursors";
import themes from "./themes";
import { characterGenerator, generateTeam } from "./generators";
import Character from "./Character";
import Team from "./Team";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.score = 0;
    this.currentLevel = 1;
    this.gamePlay.drawUi(themes[this.currentLevel - 1]);
    this.drawTeams();

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  drawTeams() {
    const userTeam = generateTeam(new Team().userTeam);
    const computerTeam = generateTeam(new Team().computerTeam);

    this.players = [...userTeam, ...computerTeam];
    this.gamePlay.redrawPositions(this.players);
  }

  addOnCellEnter() {
    this.gamePlay.addCellEnterListener(this.onCellEnter);
  }

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
}
