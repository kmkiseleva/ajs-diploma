import Character from "../Character";
import Magician from "../characters/Magician";

// Запрет создания объектов new Character
test("new Character isn't valid => throw an error", () => {
  expect(() => new Character(1)).toThrow();
});

// Создание наследников Character
test("Extends of class Character are working and creating", () => {
  const newMagician = {
    attack: 10,
    defence: 40,
    health: 100,
    level: 1,
    rangeAttack: 4,
    step: 1,
    type: "magician",
    userPlayer: true,
  };

  expect(new Magician(1)).toEqual(newMagician);
});
