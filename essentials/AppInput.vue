<template>
  <AppStack
    direction="col"
    :align="responsive ? 'stretch' : 'start'"
    :data-name="$NAME"
    :class="rootClasses"
    class="app-relative"
  >
    <component
      :is="component"
      ref="input"
      v-bind="componentProps"
      :class="componentClasses"
      v-on="listeners"
    >
      <template v-if="component === 'select'">
        <option
          v-for="option in options"
          :key="option.value"
          :selected="option.selected"
          :value="option.value"
          :disabled="option.disabled"
          :hidden="option.hidden"
          v-text="option.text"
        />
      </template>
    </component>
    <div
      v-if="icon || $slots.after || tag == 'select'"
      :class="iconClasses"
    >
      <slot name="after">
        <AppIcon
          v-if="icon || tag == 'select'"
          v-bind="iconProps"
        />
      </slot>
    </div>
  </AppStack>
</template>

<script>
  import AppStack from './AppStack.vue'
  import AppIcon from './AppIcon.vue'

  export default {
    name: 'AppInput',
    components: {
      AppStack,
      AppIcon
    },
    inject: {
      $AppFormItem: { default: null }
    },
    props: {
      /**
       * Value of the AppInput
       */
      value: {
        type: [String, Number],
        default: 0
      },
      /**
       * Sets the disabled state of AppInput
       */
      disabled: {
        type: Boolean,
        default: false
      },
      /**
       * Sets the disabled state of AppInput
       */
      responsive: {
        type: Boolean,
        default: false
      },
      /**
       * HTML [name] attribute of AppInput
       */
      name: {
        type: String,
        default: null
      },
      /**
       * HTML tag to render
       */
      tag: {
        type: String,
        default: 'input',
        validator: val => ['input', 'textarea', 'select'].includes(val)
      },
      /**
       * HTML [type] attribute of AppInput
       */
      type: {
        type: String,
        default: 'text'
      },
      /**
       * Size of the input
       */
      inputSize: {
        type: String,
        default: 'medium',
        validator: val => ['small', 'medium'].indexOf(val) > -1
      },
      /**
       * Icon name displayed on the right on the input
       */
      icon: {
        type: String,
        default: ''
      },
      options: {
        type: Array,
        default: () => ([])
      }
    },
    emits: ['input', 'change', 'focusout', 'focusin', 'keyup'],
    computed: {
      component () {
        return this.tag
      },
      rootClasses () {
        return {}
      },
      componentClasses () {
        return [
          'app-border', 'app-color-border-2', 'app-rounded-4', 'app-appearance-none',
          'app-h-36', 'app-px-16', 'app-text-14', 'app-leading-16', 'app-color-bg-1',
          'app-color-text-1', 'app-outline-none', 'app-transition-colors',
          'app-duration-150', 'app-ease-in-out', 'hover:app-color-border-4',
          'focus:app-color-border-brand', 'focus:app-shadow-input', 'focus:app-shadow'
        ]
      },
      componentProps () {
        const props = {
          ...(this.tag === 'select' || this.responsive) ? {} : {
            size: 30,
          },
          ...(this.tag === 'select') ? {} : {
            type: this.type,
            value: this.value
          }
        }

        return {
          id: this.cleanName,
          name: this.cleanName,
          disabled: this.isDisabled,
          spellcheck: false,
          ...props,
          ...this.$attrs
        }
      },
      iconProps () {
        return this.tag === 'select' ? {
          icon: 'chevron-down',
          size: 16,
          color: 3
        } : {
          icon: this.select,
          size: 20
        }
      },
      iconClasses () {
        return this.tag === 'select' ? [
          'app-absolute', 'app-top-1/2', 'app-right-12',
          'app-transform', 'app--translate-y-1/2'
        ] : []
      },
      cleanName () {
        return this.$AppFormItem ? this.$AppFormItem.prop : this.name
      },
      isDisabled () {
        return this.disabled || (this.$AppFormItem ?
          this.$AppFormItem.isDisabled
        : this.disabled)
      },
      listeners () {
        return {
          change: $event => this.$emit('change', $event.target.value),
          input: $event => this.$emit('input', $event.target.value),
          focusout: $event => this.$emit('focusout', $event.target.value),
          focusin: $event => this.$emit('focusin', $event.target.value),
          keyup: $event => this.$emit('keyup', $event.target.value)
        }
      }
    }
  }
</script>