/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// TODO:看下这个文件的一些用处，删去一些不必要的
module.exports = {
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(js|ts)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
}
