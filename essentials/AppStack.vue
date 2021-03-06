<template>
  <component
    :is="tag"
    :class="rootClasses"
    :data-name="$NAME"
    :to="to"
  >
    <slot />
  </component>
</template>

<script>
import { arrayPropValidator } from './vueTypographyMixin.js'

export default {
  name: 'AppStack',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    type: {
      type: [String, Array],
      default: 'flex',
      validator: val => arrayPropValidator(['row', 'inline'])
    },
    direction: {
      type: [String, Array],
      default: 'row',
      validator: val => arrayPropValidator(['row', 'col'])
    },
    align: {
      type: [String, Array],
      default: 'stretch',
      validator: val => arrayPropValidator(['start', 'end', 'center', 'stretch'])
    },
    content: {
      type: [String, Array],
      default: 'start',
      validator: val => arrayPropValidator(['start', 'end', 'center', 'between', 'around', 'stretch'])
    },
    wrap: {
      type: [String, Array],
      default: 'nowrap',
      validator: val => arrayPropValidator(['nowrap', 'wrap', 'wrap-reverse'])
    },
    justify: {
      type: [String, Array],
      default: 'start',
      validator: val => arrayPropValidator(['start', 'end', 'center', 'between', 'around', 'stretch'])
    },
    to: {
      type: [Object, Boolean],
      default: false
    }
  },
  computed: {
    rootClasses () {
      return [
        ...{
          flex: ['app-flex'],
          inline: ['app-inline-flex']
        }[this.$RESPONSIVE_PROP('type')],
        ...{
          row: ['app-flex-row'],
          col: ['app-flex-col']
        }[this.$RESPONSIVE_PROP('direction')],
        ...{
          start: ['app-items-start'],
          end: ['app-items-end'],
          center: ['app-items-center'],
          stretch: ['app-items-stretch']
        }[this.$RESPONSIVE_PROP('align')],
        ...{
          start: ['app-content-start'],
          end: ['app-content-end'],
          center: ['app-content-center'],
          between: ['app-content-between'],
          around: ['app-content-around'],
          stretch: []
        }[this.$RESPONSIVE_PROP('content')],
        ...{
          nowrap: ['app-flex-no-wrap'],
          wrap: ['app-flex-wrap'],
          'wrap-reverse': ['app-flex-wrap-reverse']
        }[this.$RESPONSIVE_PROP('wrap')],
        ...{
          start: ['app-justify-start'],
          end: ['app-justify-end'],
          center: ['app-justify-center'],
          between: ['app-justify-between'],
          around: ['app-justify-around'],
          stretch: []
        }[this.$RESPONSIVE_PROP('justify')],
      ]
    }
  }
}
</script>
