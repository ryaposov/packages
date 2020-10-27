export const arrayPropValidator = allowed => val => {
  if (Array.isArray(val)) {
    return val.every(item => allowed.includes(item)) && val.length === 2
  }

  return allowed.includes(val)
}

export const arrayIntToStrings = (...args) => [...args].reduce((a, b) => {
  return a.concat(!isNaN(b) ? [b.toString(), b] : b)
}, [])


const allowedColors = arrayIntToStrings(1, 2, 3, 4, 'brand')

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
      type: [String, Number, Array],
      default: 1,
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
          1: ['app-text-1'],
          2: ['app-text-2'],
          3: ['app-text-3'],
          4: ['app-text-4'],
          brand: ['app-text-brand']
        }[this.$responsiveProp('color')],
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
