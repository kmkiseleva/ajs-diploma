export default class Character {
  constructor(level, type = "generic") {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 100;
    this.type = type;
    // TODO: throw error if user use "new Character()"

    if (new.target === Character) {
      throw new Error("Don't use the new Character construction");
    }
  }

  levelUp() {
    this.level += 1;
    if (this.health === 0) {
      throw new Error("The player has already died!");
    }
    this.health += 80;
    if (this.health > 100) {
      this.health = 100;
    }
    this.attack = Math.max(
      this.attack,
      +(this.attack * (1.8 - (1 - this.health / 100))).toFixed()
    );
    this.defence = Math.max(
      this.defence,
      +(this.defence * (1.8 - (1 - this.health / 100))).toFixed()
    );
  }

  damage(scores) {
    if (this.health > 0) {
      this.health -= scores;
    } else if (this.health < 0) {
      this.health = 0;
    }
  }
}
