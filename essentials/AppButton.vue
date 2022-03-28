<template>
  <AppStack
    :tag="tag"
    :class="rootClasses"
    :data-name="$NAME"
    v-bind="rootProps"
    direction="row"
    type="inline"
    align="center"
    class="app-relative app-cursor-pointer app-select-none app-group focus:app-outline-none
      app-transition app-duration-150 app-ease-in-out hover:app-opacity-50"
  >
    <component
      :is="textTag"
      v-if="text"
      :color="color"
      :size="size"
      :weight="weight"
      :hover-color="hoverColor"
      leading="regular"
      class="app-relative app-top-1"
    >
      <span v-text="text" />
      <AppBorder
        v-if="type === 'underlined'"
        :class="underlineClasses"
        class="app-absolute app--bottom-4 app-left-0 app-w-full app-opacity-20"
      />
    </component>
    <AppIcon
      v-if="icon"
      v-bind="iconProps"
      :class="iconClasses"
      class="app-relative app--top-1"
    />
    <div
      :class="borderClasses"
      class="app-pointer-events-none app-absolute app-left-0 app-top-0 app-w-full app-h-full app-border
        app-transition app-duration-150 app-ease-in-out"
    />
  </AppStack>
</template>

<script>
import AppStack from './AppStack.vue'
import AppText from './AppText.vue'
import AppIcon from './AppIcon.vue'
import AppHeading from './AppHeading.vue'
import AppBorder from './AppBorder.vue'

import { arrayIntToStrings, arrayPropValidator } from './vueTypographyMixin.js'

const allowedTypes = ['text', 'framed', 'underlined', 'bordered']
const allowedWeights = ['extrabold', 'bold', 'semibold', 'medium', 'regular']
const allowedDensity = ['tight', 'normal', 'spaced', 'relaxed']
const allowedSizes = arrayIntToStrings(48, 36, 32, 24, 28, 20, 18, 16, 14)
const allowedColors = arrayIntToStrings(1, 2, 3, 4, 'brand', 'opposite', false)
const allowedBg = arrayIntToStrings(1, 2, 25, 3, 'brand', 'opposite', false)
const allowedBorder = arrayIntToStrings(1, 2, 3, 4, 'opposite', 'brand', false)
const allowedRounded = arrayIntToStrings(0, 2, 3, 4, 8, 16, 24, 32, 40, 48, 56, 'full')

export default {
  name: 'AppButton',
  components: {
    AppStack,
    AppText,
    AppIcon,
    AppHeading,
    AppBorder
  },
  props: {
    tag: {
      type: String,
      default: 'a'
    },
    text: {
      type: String,
      default: ''
    },
    weight: {
      type: String,
      default: 'medium',
      validator: val => allowedWeights.includes(val)
    },
    density: {
      type: [String, Array],
      default: 'normal',
      validator: arrayPropValidator(allowedDensity)
    },
    size: {
      type: [String, Number, Array],
      required: true,
      default: 14,
      validator: arrayPropValidator(allowedSizes)
    },
    color: {
      type: [String, Number, Array],
      default: 1,
      validator: arrayPropValidator(allowedColors)
    },
    hoverColor: {
      type: [String, Number, Array, Boolean],
      default: false,
      validator: arrayPropValidator(allowedColors)
    },
    underline: {
      type: [String, Number, Array, Boolean],
      default: false,
      validator: arrayPropValidator(allowedBorder)
    },
    underlineWidth: {
      type: [String, Number, Array],
      default: 1
    },
    border: {
      type: [String, Number, Array, Boolean],
      default: false,
      validator: arrayPropValidator(allowedBorder)
    },
    bg: {
      type: [String, Number, Array],
      default: 1,
      validator: arrayPropValidator(allowedBg)
    },
    hoverBg: {
      type: [String, Number, Array, Boolean],
      default: false,
      validator: arrayPropValidator(allowedBg)
    },
    type: {
      type: [String, Number, Array],
      default: 'text',
      validator: val => allowedTypes.includes(val)
    },
    rounded: {
      type: [String, Number, Array],
      default: 0,
      validator: val => allowedRounded.includes(val)
    },
    icon: {
      type: [String, Array, Boolean],
      default: false
    },
    href: {
      type: String,
      default: ''
    },
    to: {
      type: [Object, Boolean],
      default: false
    },
    textTag: {
      type: String,
      default: 'AppText'
    }
  },
  computed: {
    rootClasses () {
      return [
        ...this.radiusClasses,
        ...{
          1: ['app-bg-bg-1', 'dark:app-bg-dbg-1'],
          2: ['app-bg-bg-2', 'dark:app-bg-dbg-2'],
          25: ['app-bg-bg-25', 'dark:app-bg-dbg-25'],
          3: ['app-bg-bg-3', 'dark:app-bg-dbg-3'],
          brand: ['app-bg-bg-brand', 'dark:app-bg-dbg-brand'],
          opposite: ['app-bg-bg-opposite', 'dark:app-bg-dbg-opposite'],
        }[this.responsiveProp('bg')],
        ...{
          true: [
            ...{
              tight: [],
              normal: ['app-px-12', 'app-py-4'],
              spaced: ['app-px-20', 'app-py-8'],
              relaxed: ['app-px-20', 'app-py-12'],
            }[this.density],
            ...{
              1: ['app-bg-bg-1', 'dark:app-bg-dbg-1'],
              2: ['app-bg-bg-2', 'dark:app-bg-dbg-2'],
              25: ['app-bg-bg-25', 'dark:app-bg-dbg-25'],
              3: ['app-bg-bg-3', 'dark:app-bg-dbg-3'],
              brand: ['app-bg-bg-brand', 'dark:app-bg-dbg-brand'],
              opposite: ['app-bg-bg-opposite', 'dark:app-bg-dbg-opposite']
            }[this.bg]
          ],
          false: []
        }[this.responsiveProp('type') === 'framed'],
      ]
    },
    borderClasses () {
      return [
        ...this.radiusClasses,
        ...{
          1: ['app-border-border-1', 'dark:app-border-dborder-1'],
          2: ['app-border-border-2', 'dark:app-border-dborder-2'],
          3: ['app-border-border-3', 'dark:app-border-dborder-3'],
          4: ['app-border-border-4', 'dark:app-border-dborder-4'],
          brand: ['app-border-border-brand', 'dark:app-border-dborder-brand'],
          opposite: ['app-border-border-opposite', 'dark:app-border-dborder-opposite'],
          false: ['app-border-border-transparent', 'dark:app-border-dborder-transparent'],
        }[this.responsiveProp('border')],
      ]
    },
    radiusClasses () {
      return [
        ...{
          0: [],
          2: ['app-rounded-2'],
          3: ['app-rounded-3'],
          4: ['app-rounded-4'],
          8: ['app-rounded-8'],
          16: ['app-rounded-16'],
          32: ['app-rounded-32'],
          full: ['app-rounded-full']
        }[this.responsiveProp('rounded')],
      ]
    },
    iconClasses () {
      return [
        ...{
          true: [
            ...{
              tight: [],
              normal: ['app-ml-4'],
              spaced: [],
              relaxed: []
            }[this.density]
          ],
          false: []
        }[Boolean(this.responsiveProp('type') === 'framed' && this.text)],
      ]
    },
    underlineClasses () {
      return [
        ...{
          1: ['app-border-border-1', 'dark:app-border-dborder-1'],
          2: ['app-border-border-2', 'dark:app-border-dborder-2'],
          3: ['app-border-border-3', 'dark:app-border-dborder-3'],
          opposite: ['app-border-border-opposite', 'dark:app-border-dborder-opposite'],
          brand: ['app-border-border-brand', 'dark:app-border-dborder-brand'],
          false: []
        }[this.responsiveProp('underline')],
        ...{
          1: ['app-border-t-1'],
          2: ['app-border-t-2'],
          3: ['app-border-t-3']
        }[this.responsiveProp('underlineWidth')]
      ]
    },
    rootProps () {
      const { to, href } = this

      return {
        ...href ? { href } : {},
        ...to ? { to } : {}
      }
    },
    iconProps () {
      return {
        icon: this.icon,
        size: (parseInt(this.responsiveProp('size')) + 2) + 'px',
        color: this.color
      }
    }
  },
  methods: {
    responsiveProp (name) {
      if (Array.isArray(this[name])) {
        return this[name][this.$MD ? 1 : 0]
      } else {
        return this[name]
      }
    }
  }
}
</script>
