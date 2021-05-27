/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const indexOfCharacter = Math.floor(Math.random() * allowedTypes.length);
    const levelOfCharacter = Math.floor(Math.random() * maxLevel + 1);
    yield new allowedTypes[indexOfCharacter](levelOfCharacter);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const dreamTeam = [];
  for (let i = 0; i < characterCount; i += 1) {
    const newCharacter = characterGenerator(allowedTypes, maxLevel);
    dreamTeam.push(newCharacter.next().value);
  }
  return dreamTeam;
}
