import typescript from "@rollup/plugin-typescript" // 让 rollup 认识 ts 的代码
import pkg from "./package.json"

// 为了将引入的 npm 包，也打包进最终结果中
import resolve from "rollup-plugin-node-resolve"
import { terser } from "rollup-plugin-terser"
import commonjs from "@rollup/plugin-commonjs"

// 一段自定义的内容，以下内容会添加到打包结果中
const footer = `
if(typeof window !== 'undefined') {
  window._PrettyEventEmitter_VERSION_ = '${pkg.version}'
}`

export default {
  input: "./src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "auto",
      footer
    },
    {
      file: pkg.module,
      format: "esm",
      footer
    },
    {
      file: pkg.browser,
      format: "umd",
      name: "PrettyEventEmitter",
      footer
    }
  ],
  plugins: [typescript(), commonjs(), resolve(), terser()]
}
