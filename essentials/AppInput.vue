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
      :style="componentStyles"
      :class="componentClasses"
      v-on="listeners"
    >
      <template v-if="component === 'select'">
        <option
          v-for="option in options"
          :key="option.value"
          :selected="option.value === value"
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
      responsive: {
        type: Boolean,
        default: false
      },
      transparent: {
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
        default: 'md',
        validator: val => ['sm', 'md'].indexOf(val) > -1
      },
      rows: {
        type: [String, Number],
        default: 4
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
          'app-border', 'app-border-border-2', 'dark:app-border-dborder-2', 'app-rounded-4', 'app-appearance-none',
          'app-text-14', 'app-leading-16', ...!this.transparent ? ['app-bg-bg-1', 'dark:app-bg-dbg-1'] : ['app-bg-bg-transparent', 'dark:app-bg-dbg-transparent'],
          'app-text-text-1', 'dark:app-text-dtext-1', 'app-outline-none', 'app-transition-colors',
          'app-duration-150', 'app-ease-in-out', 'hover:app-border-border-4', 'dark:hover:app-border-dborder-4',
          'focus:app-border-border-brand', 'dark:focus:app-border-dborder-brand', 'focus:app-shadow-input', 'focus:app-shadow',
          ...{
            sm: ['app-h-28', 'app-px-12'],
            md: ['app-h-36', 'app-px-16']
          }[this.inputSize],
          ...{
            textarea: ['app-py-12', 'app-h-initial'],
            input: [],
            select: []
          }[this.tag]
        ]
      },
      componentStyles () {
        return this.tag === 'textarea' ? {
          minHeight: (this.rows * 20) + 'px'
        } : {}
      },
      componentProps () {
        const props = {
          ...(this.tag === 'select' || this.responsive) ? {} : {
            size: 30,
          },
          ...(this.tag === 'select' || this.tag === 'textarea') ? {} : {
            type: this.type,
          },
          ...(this.tag === 'select') ? {} : {
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
          'app-absolute', 'app-top-1/2', 'app-right-12', 'app--translate-y-1/2'
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
