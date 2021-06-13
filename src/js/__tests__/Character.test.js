import Character from '../Character';
import Magician from '../characters/Magician';

// Запрет создания объектов new Character
test("new Character isn't valid => throw an error", () => {
  expect(() => new Character(1)).toThrow();
});

// Создание наследников Character
test('Extends of class Character are working and creating', () => {
  const newMagician = {
    attack: 10,
    defence: 40,
    health: 100,
    level: 1,
    rangeAttack: 4,
    step: 1,
    type: 'magician',
    userPlayer: true,
  };

  expect(new Magician(1)).toEqual(newMagician);
});

// Метод levelUp
test('Method levelUp is counting correctly', () => {
  const magician = new Magician(1);
  magician.levelUp();
  const expected = {
    type: 'magician',
    level: 2,
    attack: 18,
    defence: 72,
    health: 100,
    step: 1,
    rangeAttack: 4,
    userPlayer: true,
  };

  expect(magician).toEqual(expected);
});
