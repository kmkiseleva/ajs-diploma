export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi("prairie");
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
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
