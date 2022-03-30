<template>
  <picture
    :class="rootClasses"
    :data-name="$NAME"
    class="app-image"
    v-on="$listeners"
  >
    <source
      v-if="desktop"
      :key="generateKey('desktop')"
      :srcset="srcSet('desktop')"
      media="(min-width: 768px)"
    >
    <source
      v-if="mobile"
      :key="generateKey('mobile')"
      :srcset="srcSet('mobile')"
      media="(max-width: 768px)"
    >
    <img
      v-bind="imageOptions"
      class="app-max-w-initial"
      v-on="$listeners"
    >
  </picture>
</template>

<script>
  export default {
    name: 'AppImage2',
    props: {
      src: {
        type: String,
        default: ''
      },
      srcset: {
        type: String,
        default: ''
      },
      desktop: {
        type: String,
        default: ''
      },
      mobile: {
        type: String,
        default: ''
      },
      alt: {
        type: String,
        default: ''
      },
      lazy: {
        type: Boolean,
        default: false
      },
      imgClass: {
        type: String,
        default: ''
      },
      size: {
        type: String,
        default: 'contain',
        validator: value => ['contain', 'cover'].includes(value)
      },
      position: {
        type: String,
        default: 'center',
        validator: value => ['center', 'left', 'top', 'bottom', 'right'].includes(value)
      },
      sizing: {
        type: String,
        default: 'auto',
        validator: value => ['auto', 'fixed'].includes(value)
      },
    },
    computed: {
      rootClasses () {
        return [
          ...{
            contain: [],
            cover: ['app-flex']
          }[this.size],
          ...{
            left: ['app-image--left'],
            top: ['app-image--top'],
            right: ['app-image--right'],
            bottom: ['app-image--bottom'],
            center: []
          }[this.position],
        ]
      },
      imageClasses () {
        return [
          ...{
            contain: ['app-object-contain'],
            cover: ['app-object-cover', 'app-w-full', 'app-h-full']
          }[this.size],
          ...{
            left: ['app-object-left'],
            top: ['app-object-top'],
            right: ['app-object-right'],
            bottom: ['app-object-bottom'],
            center: []
          }[this.position],
          ...{
            auto: [],
            fixed: ['app-w-full', 'app-h-full']
          }[this.sizing],
        ]
      },
      imageOptions () {
        let srcsetMixin = {}

        if (this.srcset) {
          srcsetMixin = {
            src: this.src || null,
            srcset: this.srcset
          }
        }

        return {
          key: null,
          src: this.src,
          alt: this.alt,
          lazy: this.lazy,
          class: [
            ...this.imageClasses,
            {
              [this.imgClass]: this.imgClass
            }
          ],
          ...srcsetMixin
        }
      }
    },
    methods: {
      srcSet (device) {
        return this[device]
      },
      generateKey (type) {
        return `${this.srcSet(type)}-${type}`
      }
    }
  }
</script>
