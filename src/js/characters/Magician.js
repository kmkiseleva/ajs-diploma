import Character from '../Character';

export default class Magician extends Character {
  constructor(level) {
    super(level);
    this.type = 'magician';
    this.attack = 10;
    this.defence = 40;
    this.step = 1;
    this.rangeAttack = 4;
    this.userPlayer = true;
  }
}
