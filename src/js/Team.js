import Bowman from "./Bowman";
import Swordsman from "./Swordsman";
import Magician from "./Magician";
import Vampire from "./Vampire";
import Undead from "./Undead";
import Daemon from "./Daemon";

export default class Team {
  constructor() {
    this.playerTeam = [Bowman, Swordsman, Magician];
    this.computerTeam = [Vampire, Undead, Daemon];
  }
}