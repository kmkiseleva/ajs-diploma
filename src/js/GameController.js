import GamePlay from "./GamePlay";
import GameState from "./GameState";
import cursors from "./cursors";
import themes from "./themes";
import { characterGenerator, generateTeam } from "./generators";
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

  // начало игры
  startGame() {
    this.scores = 0;
    this.currentLevel = 1;
    this.gamePlay.drawUi(themes[this.currentLevel - 1]);
    this.selectedChar = null;
    this.userTurn = true;

    // создание команды
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
    this.players = [
      ...this.userTeamWithPositions,
      ...this.computerTeamWithPositions,
    ];
    this.gamePlay.redrawPositions(this.players);

    // возможность ходов и атак
    this.stepPossibility = false;
    this.attackPossibility = false;
  }

  // установка первоначальных позиций игроков
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

  // Events
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
    // текущий игрок в ячейке
    const currentChar = this.players.find((char) => char.position === index);

    // всплытие информации об игроке при наведении
    if (currentChar) {
      const { level, attack, defence, health } = currentChar.character;
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.showCellTooltip(
        `🎖${level} ⚔${attack} 🛡${defence} ❤${health}`,
        index
      );
    } else {
      this.gamePlay.setCursor(cursors.auto);
    }

    // подсвечивание ячейки зеленым (в рамках допустимых переходов)
    if (this.selectedChar && !currentChar) {
      this.stepPossibility = checkForStep(
        this.selectedChar.position,
        index,
        this.selectedChar.character.step
      );

      if (this.stepPossibility) {
        this.gamePlay.selectCell(index, "green");
        this.gamePlay.setCursor(cursors.pointer);
      }
    }

    // подсвечивание ячейки красным (в рамках допустимого радиуса атаки)
    if (this.selectedChar && currentChar && !currentChar.character.userPlayer) {
      this.attackPossibility = checkForAttack(
        this.selectedChar.position,
        index,
        this.selectedChar.character.rangeAttack
      );
      if (this.attackPossibility) {
        this.gamePlay.selectCell(index, "red");
        this.gamePlay.setCursor(cursors.crosshair);
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  onCellClick(index) {
    // TODO: react to click
    const currentChar = this.players.find((char) => char.position === index);

    // выбор игрока при клике на ячейку либо ошибка, если игрок - компьютерный
    if (currentChar && currentChar.character.userPlayer) {
      this.players.forEach((char) => this.gamePlay.deselectCell(char.position));
      this.gamePlay.selectCell(index);
      this.selectedChar = currentChar;
    }

    if (
      currentChar &&
      !currentChar.character.userPlayer &&
      !this.attackPossibility
    ) {
      GamePlay.showError("This is a computer player! Choose your one.");
    }

    // ход выбранного игрока в допустимую ячейку
    if (
      this.selectedChar &&
      !currentChar &&
      this.selectedChar.position !== index
    ) {
      let currentPosition = this.selectedChar.position;
      if (this.stepPossibility) {
        this.selectedChar.position = index;
        this.gamePlay.redrawPositions(this.players);
        this.gamePlay.selectCell(index);
        this.gamePlay.deselectCell(currentPosition);
      }
    }

    // атака выбранного игрока на допустимую ячейку с компьютерным игроком и
    // удаление атакуемого игрока, если его здоровье стало <= 0
    if (
      this.selectedChar &&
      currentChar &&
      !currentChar.character.userPlayer &&
      this.selectedChar.position !== index &&
      this.attackPossibility
    ) {
      const attacker = this.selectedChar;
      const target = currentChar;
      const damagePoints = Math.max(
        attacker.character.attack - target.character.defence,
        attacker.character.attack * 0.1
      );
      target.character.damage(damagePoints);

      this.players = this.players.filter((char) => char.character.health > 0);
      this.gamePlay.redrawPositions(this.players);
      this.gamePlay
        .showDamage(index, damagePoints)
        .then(() => this.finalOfEveryTurn());
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
    if (this.selectedChar && this.selectedChar.position !== index) {
      this.gamePlay.deselectCell(index);
    }
  }

  // действия в конце хода
  finalOfEveryTurn() {
    // очередность ходов
    if (this.userTurn) {
      this.userTurn = false;
      // this.computerTurn();
    } else {
      this.userTurn = true;
    }

    // очистка поля от выделений
    this.gamePlay.cells.forEach((cell) =>
      this.gamePlay.deselectCell(this.gamePlay.cells.indexOf(cell))
    );

    // удаление погибших
    if (this.selectedChar && this.selectedChar.character.health <= 0) {
      this.selectedChar = null;
    }

    // отрисовка персонажей с учетом изменений
    this.gamePlay.redrawPositions(this.players);

    if (this.selectedChar) {
      this.gamePlay.selectCell(this.selectedChar.position);
    }

    // команда компьютера мертва => переход на уровень выше
    if (
      [...this.players].filter((char) => char.character.userPlayer === false)
        .length === 0
    ) {
      this.toNextLevel();
      return;
    }

    if (
      [...this.players].filter((char) => char.character.userPlayer).length === 0
    ) {
      this.theEnd();
      GamePlay.showMessage("Game Over!");
      return;
    }
  }

  computerTurn() {
    // расстановка сил и команды
    const pcTeam = [];
    const userTeam = [];

    this.players.forEach((char) => {
      if (char.character.userPlayer) {
        userTeam.push(char);
      } else {
        pcTeam.push(char);
      }
    });
  }

  // сделать ход
  makeMove(char, index) {
    this.players = [...this.players].filter((item) => item !== char);
    char.position = index;
    this.players.push(char);
    this.finalOfEveryTurn();
  }

  // переход на следующий уровень или конец игры
  toNextLevel() {
    if (this.currentLevel === 4) {
      GamePlay.showMessage("You Win!");
      return;
    } else {
      this.currentLevel += 1;
      GamePlay.showMessage("New Level!");
    }

    // отрисовка темы
    this.gamePlay.drawUi(themes[this.currentLevel - 1]);

    // создание новых дополнительных игроков и обновление команд
    let additionalUserChars;
    if (this.currentLevel > 2) {
      additionalUserChars = generateTeam(
        new Team().userTeam,
        this.currentLevel - 1,
        2
      );
    } else {
      additionalUserChars = generateTeam(
        new Team().userTeam,
        this.currentLevel - 1,
        1
      );
    }
    const newUserChars = [...this.players].map((char) => char.character);
    const newUserTeam = [...newUserChars, ...additionalUserChars];

    const newComputerChars = generateTeam(
      new Team().computerTeam,
      this.currentLevel,
      newUserTeam.length
    );

    this.setPositions(newUserTeam, newComputerChars);
    this.computerTeamWithPositions.pop();

    this.players = [
      ...this.userTeamWithPositions,
      ...this.computerTeamWithPositions,
    ];

    // отрисовка поля с учетом изменений
    this.gamePlay.cells.forEach((cell) =>
      this.gamePlay.deselectCell(this.gamePlay.cells.indexOf(cell))
    );
    this.selectedChar = null;
    this.gamePlay.redrawPositions(this.players);
  }

  theEnd() {
    this.blockTheField();
    this.gamePlay.redrawPositions(this.players);
  }

  blockTheField() {
    this.clickCellsListener = [];
    this.enterOnCellsListener = [];
    this.leaveCellsListener = [];
  }

  onNewGame() {
    this.startGame();
    this.clickCellsListener();
    this.enterOnCellsListener();
    this.leaveCellsListener();
  }

  onSaveGame() {
    const savingTheGame = {
      level: this.currentLevel,
      scores: this.scores,
      turn: this.userTurn,
      players: this.players,
    };

    this.stateService.save(GameState.from(savingTheGame));
  }

  onLoadGame() {
    const savedGame = GameState.from(this.stateService.load());

    if (!savedGame) {
      throw new Error("There is no saved game");
    }

    this.currentLevel = savedGame.level;
    this.scores = savedGame.scores;
    this.userTurn = savedGame.turn;
    this.players = savedGame.players;

    this.gamePlay.drawUi(themes[this.currentLevel - 1]);
    this.gamePlay.redrawPositions(this.players);
  }
}

// дополнительные функции

// перевод поля в двумерную плоскость

function twoDimensionalBoard() {
  return new Array(64)
    .fill(0)
    .map((item, index) => (index += 1))
    .map((item, index) => ({ x: index % 8, y: Math.floor(index / 8) }));
}

// функция проверки хода
function checkForStep(currentPosition, possiblePosition, step) {
  const newArrayOfCoordinates = twoDimensionalBoard();
  const currentDot = newArrayOfCoordinates[currentPosition];
  const possibleDot = newArrayOfCoordinates[possiblePosition];

  const modX = Math.abs(currentDot.x - possibleDot.x);
  const modY = Math.abs(currentDot.y - possibleDot.y);
  const modXY = Math.abs(modX - modY);

  if (modX <= step && modY <= step) {
    if (modXY !== 1 || modX === 0 || modY === 0) {
      return true;
    }
  }
}

// функция проверки атаки
function checkForAttack(currentPosition, possiblePosition, rangeAttack) {
  const newArrayOfCoordinates = twoDimensionalBoard();
  const currentDot = newArrayOfCoordinates[currentPosition];
  const possibleDot = newArrayOfCoordinates[possiblePosition];

  const modX = Math.abs(currentDot.x - possibleDot.x);
  const modY = Math.abs(currentDot.y - possibleDot.y);

  if (modX <= rangeAttack && modY <= rangeAttack) {
    return true;
  }
}
