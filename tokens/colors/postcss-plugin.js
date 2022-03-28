const PLUGIN_NAME = 'postcss-import-css-variables'
const RULE_NAME = 'import-variables'

export default (options = {}) => ({
  postcssPlugin: PLUGIN_NAME,
  Once (root, { Declaration }) {
    root.walkAtRules(RULE_NAME, rule => {
      try {
        const uri = rule.params.replace(/["']/g, '')
        const content = require(options.resolve ? options.resolve(uri) : uri)

        for (const variable in content) {
          const value = content[variable]
          const decl = new Declaration({ prop: variable, value: String(value) })

          rule.before(decl)
        }

        rule.remove()
      } catch (error) {
        throw rule.error(error.message, { plugin: PLUGIN_NAME });
      }
    })
  }
})
