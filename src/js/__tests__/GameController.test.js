import GameController from '../GameController';
import GameStateService from '../GameStateService';
import GamePlay from '../GamePlay';
import Swordsman from '../characters/Swordsman';
import PositionedCharacter from '../PositionedCharacter';

let gamePlay; let stateService; let
  gameController;

// тест на тегированный шаблон (tooltip)
test("Method 'showCellTooltip' is working correctly", () => {
  const container = document.createElement('div');
  container.setAttribute('id', 'game-container');
  gamePlay = new GamePlay();
  gamePlay.bindToDOM(container);

  stateService = new GameStateService(localStorage);
  gameController = new GameController(gamePlay, stateService);

  gameController.init();
  gameController.players = [
    new PositionedCharacter(new Swordsman(1), 1),
  ];
  gameController.gamePlay.redrawPositions(gameController.players);

  gameController.gamePlay.showCellTooltip = jest.fn();
  gameController.onCellEnter(1);

  expect(gameController.gamePlay.showCellTooltip).toBeCalled();
});
