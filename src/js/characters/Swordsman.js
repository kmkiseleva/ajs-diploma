import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level) {
    super(level);
    this.type = 'swordsman';
    this.attack = 40;
    this.defence = 10;
    this.step = 4;
    this.rangeAttack = 1;
    this.userPlayer = true;
  }
}
