const PLUGIN_NAME = 'postcss-import-css-variables'
const RULE_NAME = 'import-variables'

module.exports = (options = {}) => ({
  postcssPlugin: PLUGIN_NAME,
  Once (root, { result, Declaration }) {
    root.walkAtRules(RULE_NAME, rule => {
      try {
        const uri = rule.params.replace(/["']/g, '')
        const content = require(options.resolve ? options.resolve(uri) : uri)

        for (const variable in content) {
          const value = content[variable]
          const variableNode = new Declaration({ prop: variable, value: String(value) })
          variableNode.source = rule.source

          rule.parent.insertBefore(rule, variableNode)
        }
        rule.remove()
      } catch (error) {
        throw rule.error(error.message, { plugin: PLUGIN_NAME });
      }
    })
  }
})

module.exports.postcss = true
