export const arrayPropValidator = allowed => val => {
  if (Array.isArray(val)) {
    return val.every(item => allowed.includes(item)) && val.length === 2
  }

  return allowed.includes(val)
}

export const arrayIntToStrings = (...args) => [...args].reduce((a, b) => {
  return a.concat(!isNaN(b) ? [b.toString(), b] : b)
}, [])


const allowedColors = arrayIntToStrings(1, 2, 3, 4, 'brand', 'opposite', false)

export default (
  { tag, display, weight, leading },
  { allowedTags, allowedDisplay, allowedWeights, allowedSizes, allowedLeading = [leading] }
) => ({
  props: {
    tag: {
      type: [String, Array],
      default: tag,
      validator: val => allowedTags.includes(val)
    },
    html: {
      type: [String, Array],
      default: ''
    },
    text: {
      type: [String, Array],
      default: ''
    },
    display: {
      type: [String, Array],
      default: display,
      validator: val => arrayPropValidator(allowedDisplay)
    },
    weight: {
      type: [String, Number, Array],
      default: weight,
      validator: val => arrayPropValidator(allowedWeights)
    },
    size: {
      type: [String, Number, Array],
      required: true,
      validator: arrayPropValidator(allowedSizes)
    },
    leading: {
      type: [String, Array],
      default: leading,
      validator: arrayPropValidator(allowedLeading)
    },
    color: {
      type: [String, Number, Array, Boolean],
      default: 1,
      validator: arrayPropValidator(allowedColors)
    },
    hoverColor: {
      type: [String, Number, Array, Boolean],
      default: false,
      validator: arrayPropValidator(allowedColors)
    },
    to: {
      type: [Object, Boolean],
      default: false
    },
  },
  computed: {
    $rootProps () {
      const { to } = this

      return {
        ...to ? { to } : {}
      }
    },
    $rootClasses () {
      return [
        ...{
          block: ['app-block'],
          inline: ['app-inline']
        }[this.$responsiveProp('display')],
        ...{
          false: [],
          1: ['app-text-text-1', 'dark:app-text-dtext-1'],
          2: ['app-text-text-2', 'dark:app-text-dtext-2'],
          3: ['app-text-text-3', 'dark:app-text-dtext-3'],
          4: ['app-text-text-4', 'dark:app-text-dtext-4'],
          brand: ['app-text-text-brand', 'dark:app-text-dtext-brand'],
          opposite: ['app-text-text-opposite', 'dark:app-text-dtext-opposite']
        }[this.$responsiveProp('color')],
        ...{
          false: [],
          1: ['hover:app-text-text-1', 'dark:hover:app-text-dtext-1'],
          2: ['hover:app-text-text-2', 'dark:hover:app-text-dtext-2'],
          3: ['hover:app-text-text-3', 'dark:hover:app-text-dtext-3'],
          4: ['hover:app-text-text-4', 'dark:hover:app-text-dtext-4'],
          brand: ['hover:app-text-text-brand', 'dark:hover:app-text-dtext-brand'],
          opposite: ['hover:app-text-text-opposite', 'dark:hover:app-text-dtext-opposite']
        }[this.$responsiveProp('hoverColor')],
      ]
    }
  },
  methods: {
    $responsiveProp (name) {
      if (Array.isArray(this[name])) {
        return this[name][this.$MD ? 1 : 0]
      } else {
        return this[name]
      }
    }
  }
})
