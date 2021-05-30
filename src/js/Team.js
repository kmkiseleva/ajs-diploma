import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import Vampire from "./characters/Vampire";
import Undead from "./characters/Undead";
import Daemon from "./characters/Daemon";

export default class Team {
  constructor() {
    this.userTeam = [Bowman, Swordsman, Magician];
    this.computerTeam = [Vampire, Undead, Daemon];
  }
}
