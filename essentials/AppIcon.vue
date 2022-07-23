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
  const allowedColors = arrayIntToStrings(1, 2, 3, 4, 'brand', 'opposite', false)

  export default {
    name: 'AppIcon',
    props: {
      icon: {
        type: String,
        default: ''
      },
      size: {
        type: [String, Number, Array, Boolean],
        default: false
      },
      width: {
        type: [String, Array, Boolean],
        default: false
      },
      height: {
        type: [String, Array, Boolean],
        default: false
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
    },
    computed: {
      rootClasses () {
        return [
          ...{
            1: ['app-text-text-1', 'dark:app-text-dtext-1'],
            2: ['app-text-text-2', 'dark:app-text-dtext-2'],
            3: ['app-text-text-3', 'dark:app-text-dtext-3'],
            4: ['app-text-text-4', 'dark:app-text-dtext-4'],
            brand: ['app-text-text-brand', 'dark:app-text-dtext-brand'],
            opposite: ['app-text-text-opposite', 'dark:app-text-dtext-opposite'],
            false: []
          }[this.$responsiveProp('color')],
          ...{
            false: [],
            1: ['hover:app-text-text-1', 'dark:app-text-dtext-1'],
            2: ['hover:app-text-text-2', 'dark:app-text-dtext-2'],
            3: ['hover:app-text-text-3', 'dark:app-text-dtext-3'],
            4: ['hover:app-text-text-4', 'dark:app-text-dtext-4'],
            brand: ['hover:app-text-text-brand', 'dark:app-text-dtext-brand'],
            opposite: ['hover:app-text-text-opposite', 'dark:app-text-dtext-opposite']
          }[this.$responsiveProp('hoverColor')],
        ]
      },
      rootStyles () {
        return this.$responsiveProp('size') || (this.$responsiveProp('width') && this.$responsiveProp('height')) ? {
          width: this.$responsiveProp('size') || this.$responsiveProp('width'),
          height: this.$responsiveProp('size') || this.$responsiveProp('height')
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
