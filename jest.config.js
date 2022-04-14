/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(js|ts)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
}
