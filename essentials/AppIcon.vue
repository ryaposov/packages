<template>
  <svg
    :class="rootClasses"
    :style="rootStyles"
    class="app-icon"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :data-name="$NAME"
  >
    <use
      :xlink:href="iconPath"
      :href="iconPath"
    />
  </svg>
</template>

<script>
  import { arrayPropValidator, arrayIntToStrings } from './vueTypographyMixin.js'
  const allowedColors = arrayIntToStrings(1, 2, 3, 4, 'brand', false)

  export default {
    name: 'AppIcon',
    props: {
      icon: {
        type: String,
        default: ''
      },
      size: {
        type: [String, Boolean],
        default: false
      },
      width: {
        type: [String, Boolean],
        default: false
      },
      height: {
        type: [String, Boolean],
        default: false
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
    },
    computed: {
      rootClasses () {
        return [
          ...{
            1: ['app-color-text-1'],
            2: ['app-color-text-2'],
            3: ['app-color-text-3'],
            4: ['app-color-text-4'],
            brand: ['app-color-text-brand'],
            opposite: ['app-color-text-opposite']
          }[this.$responsiveProp('color')],
          ...{
            false: [],
            1: ['hover:app-color-text-1'],
            2: ['hover:app-color-text-2'],
            3: ['hover:app-color-text-3'],
            4: ['hover:app-color-text-4'],
            brand: ['hover:app-color-text-brand'],
            opposite: ['hover:app-color-text-opposite']
          }[this.$responsiveProp('hoverColor')],
        ]
      },
      rootStyles () {
        return this.size || (this.width && this.height) ? {
          width: this.size || this.width,
          height: this.size || this.height
        } : {}
      },
      iconPath () {
        return (this.$APP_ICON_SPRITE_PATH || '') + '#app-icon-' + this.icon
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
  }
</script>

<style>
  .app-icon {
    width: 16px;
    height: 16px;
    display: inline-block;
    color: inherit;
    vertical-align: middle;
    fill: currentColor;

    &-up {
      transform: rotate(0deg);
    }

    &-right {
      transform: rotate(90deg);
    }

    &-down {
      transform: rotate(180deg);
    }

    &-left {
      transform: rotate(-90deg);
    }
  }
</style>
