var Combinator = require('./../src/Generador/Combinador');
var Utils = require("./utils");
const {
  permutationLength,
  cartasianProductLength
} = Utils
describe('Combinator', () => {
  test('Combinations length(averageTarget)', async () => {
    const averageTarget = [
      [["A1", "A101"], ["A2"], ["A3", "A103"]],
      [["B1"], ["B2", "B102"], ["B3", "B103"]],
      [["C1", "C101"], ["C2"], ["C3"]],
      [["D1", "D101"], ["D3", "D103"]]
    ];
    expect(new Combinator(averageTarget).Resultados)
      .toHaveLength(permutationLength(averageTarget) * cartasianProductLength(averageTarget));
  });
  test('Combinations length(smallTarget)', async () => {
    const smallTarget = [
      [["A1", "A101"], ["A2"], ["A3", "A103"]],
      [["B1"], ["B2", "B102"], ["B3", "B103"]]
    ];
    expect(new Combinator(smallTarget).Resultados)
      .toHaveLength(permutationLength(smallTarget) * cartasianProductLength(smallTarget));
  });
  test('Combinations length(mediumTarget)', async () => {
    const mediumTarget = [
      [["A1", "A101"], ["A2"], ["A3", "A103"]],
      [["C1", "C101"], ["C2"], ["C3"]],
      [["D1", "D101"], ["D3", "D103"]]
    ];
    expect(new Combinator(mediumTarget).Resultados)
      .toHaveLength(permutationLength(mediumTarget) * cartasianProductLength(mediumTarget));
  });
})
