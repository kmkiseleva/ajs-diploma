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
    const levelOfCharacter = Math.ceil(Math.random() * maxLevel);
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

export function checkForStep(currentPosition, possiblePosition, step) {
  const validCells = [];
  for (let i = 1; i <= step; i += 1) {
    validCells.push(
      currentPosition + i,
      currentPosition - i,
      currentPosition + i * 7,
      currentPosition - i * 7,
      currentPosition + i * 8,
      currentPosition - i * 8,
      currentPosition + i * 9,
      currentPosition - i * 9
    );
  }
  if (validCells.includes(possiblePosition)) {
    return true;
  }
}

export function checkForAttack(currentPosition, possiblePosition, rangeAttack) {
  const validCells = [];
  for (let i = 1; i <= rangeAttack; i += 1) {
    validCells.push(
      currentPosition + i,
      currentPosition - i,
      currentPosition + i * 7,
      currentPosition - i * 7,
      currentPosition + i * 8,
      currentPosition - i * 8,
      currentPosition + i * 9,
      currentPosition - i * 9
    );
  }
  if (validCells.includes(possiblePosition)) {
    return true;
  }
}
