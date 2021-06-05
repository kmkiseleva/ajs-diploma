import { calcTileType } from "../utils";

// тестирование функции отрисовки поля
test.each([
  [0, "top-left"],
  [5, "top"],
  [7, "top-right"],
  [8, "left"],
  [23, "right"],
  [27, "center"],
  [56, "bottom-left"],
  [58, "bottom"],
  [63, "bottom-right"],
])("Function calcTileTipe is working correctly", (index, expected) => {
  expect(calcTileType(index, 8)).toBe(expected);
});
