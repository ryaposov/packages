<template>
  <component
    :is="$responsiveProp('tag')"
    :class="rootClasses"
    :data-name="$NAME"
    class="app-tracking-tight"
    v-bind="$rootProps"
  >
    <span
      v-if="html"
      class="app-br"
      v-html="$responsiveProp('html')"
    />
    <slot v-else>
      {{ $responsiveProp('text') }}
    </slot>
  </component>
</template>

<script>
import vueTypographyMixin, { arrayIntToStrings } from './vueTypographyMixin.js'

const allowedTags = ['span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'NuxtLink', 'a']
const allowedWeights = ['extrabold', 'bold', 'semibold, medium']
const allowedSizes = arrayIntToStrings(48, 36, 32, 28, 24, 20, 18, 16)
const allowedLeading = ['regular', 'compact']

export default {
  name: 'AppHeading',
  mixins: [vueTypographyMixin(
    { tag: 'span', display: 'block', weight: 'bold', color: '1', leading: 'regular' },
    { allowedTags, allowedWeights, allowedSizes, allowedLeading }
  )],
  props: {
    // Props inherited from mixin
  },
  computed: {
    rootClasses () {
      return [
        ...this.$rootClasses,
        ...{
          extrabold: ['app-font-extrabold'],
          bold: ['app-font-bold'],
          semibold: ['app-font-semibold']
        }[this.$responsiveProp('weight')],
        ...{
          48: {
            regular: ['app-text-48', 'app-leading-140'],
            compact: ['app-text-48', 'app-leading-125'],
          },
          44: {
            regular: ['app-text-44', 'app-leading-140'],
            compact: ['app-text-44', 'app-leading-125'],
          },
          36: {
            regular: ['app-text-36', 'app-leading-140'],
            compact: ['app-text-36', 'app-leading-125'],
          },
          32: {
            regular: ['app-text-32', 'app-leading-140'],
            compact: ['app-text-32', 'app-leading-125'],
          },
          28: {
            regular: ['app-text-28', 'app-leading-140'],
            compact: ['app-text-28', 'app-leading-125'],
          },
          24: {
            regular: ['app-text-24', 'app-leading-140'],
            compact: ['app-text-24', 'app-leading-125'],
          },
          20: {
            regular: ['app-text-20', 'app-leading-140'],
            compact: ['app-text-20', 'app-leading-125'],
          },
          18: {
            regular: ['app-text-18', 'app-leading-140'],
            compact: ['app-text-18', 'app-leading-125'],
          },
          16: {
            regular: ['app-text-16', 'app-leading-140'],
            compact: ['app-text-16', 'app-leading-125'],
          },
        }[this.$responsiveProp('size')][this.$responsiveProp('leading')]
      ]
    }
  },
  methods: {
    // Methods inherited from mixin
  }
}
</script>
