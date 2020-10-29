<template>
  <AppStack
    :data-name="$NAME"
    :class="rootClasses"
    class="app-group"
  >
    <span
      class="app-cursor-pointer app-relative app-mr-8 app-w-16 app-h-16"
    >
      <AppIcon
        :class="iconClasses"
        icon="checkmark"
        size="10"
        class="app-absolute app-top-1/2 app-left-1/2
          app-transition app-duration-200 app-ease-in-out
          app-transform app--translate-x-1/2 app--translate-y-1/2"
      />
      <input
        class="app-cursor-pointer app-absolute app-w-full app-h-full
          app-appearance-none app-border app-color-border-2 app-rounded-2 
          app-transition-colors app-duration-150 app-ease-in-out app-outline-none
          focus:app-color-border-brand group-hover:app-color-border-4 focus:app-shadow-input focus:app-shadow"
        v-bind="inputProps"
        @change="change"
      >
    </span>
    <AppText
      v-if="$slots['default'] || label"
      :for="id"
      tag="label"
      size="14"
      weight="regular"
      color="2"
      class="app-cursor-pointer"
    >
      <slot>{{ label }}</slot>
    </AppText>
  </AppStack>
</template>

<script>
  import AppStack from './AppStack.vue'
  import AppText from './AppText.vue'
  import AppIcon from './AppIcon.vue'

  export default {
    name: 'AppCheckbox',
    components: {
      AppStack,
      AppText,
      AppIcon
    },
    inject: {
      $AppCheckboxGroup: { default: null },
      $AppFormItem: { default: null }
    },
    model: {
      prop: 'checked',
      event: 'change'
    },
    props: {
      /**
       * State of the active AppCheckbox, supports v-model
       */
      checked: {
        type: [Boolean, Array, String, Number],
        default: false
      },
      /**
       * Value of the AppCheckbox
       */
      value: {
        type: [String, Number, Object],
        default: null
      },
      /**
       * Sets the disabled state of AppCheckbox
       */
      disabled: {
        type: Boolean,
        default: false
      },
      /**
       * Label of the AppCheckbox
       */
      label: {
        type: String,
        default: ''
      },
      /**
       * HTML [name] attribute of AppCheckbox
       */
      name: {
        type: String,
        default: null
      }
    },
    emits: ['change'],
    computed: {
      rootClasses () {
        return {
          
        }
      },
      iconClasses () {
        return [
          ...{
            true: ['app-opacity-100'],
            false: ['app-opacity-0', 'app-scale-50']
          }[this.isChecked]
        ]
      },
      inputProps () {
        return {
          id: this.id,
          type: 'checkbox',
          name: this.prop,
          checked: this.isChecked,
          disabled: this.isDisabled,
          value: this.value === null ? this.checked : this.value,
          ...this.$attrs
        }
      },
      prop () {
        if (this.name) {
          return this.name
        } else if (this.$AppCheckboxGroup) {
          return this.$AppCheckboxGroup.prop
        } else if (this.$AppFormItem) {
          return this.$AppFormItem.prop
        } else {
          return this.name
        }
      },
      id () {
        return this.prop + '-' + this.value
      },
      safeChecked () {
        return this.$AppCheckboxGroup ?
          this.$AppCheckboxGroup.checked
        : this.checked
      },
      isDisabled () {
        return this.disabled || (this.$AppCheckboxGroup ?
          this.$AppCheckboxGroup.isDisabled
        : this.disabled)
      },
      isChecked () {
        return Array.isArray(this.safeChecked) ?
          this.safeChecked.find(item => item === this.value) : this.safeChecked
      },
      nextChecked () {
        let newChecked = Array.isArray(this.safeChecked) ? [...this.safeChecked] : this.safeChecked

        if (Array.isArray(this.safeChecked)) {
          newChecked = [...this.safeChecked]
          const checkedIndex = this.safeChecked.findIndex(item => item === this.value)

          if (checkedIndex < 0) {
            newChecked.push(this.value)
          } else {
            newChecked.splice(checkedIndex, 1)
          }
        } else {
          newChecked = !newChecked
        }

        return newChecked
      }
    },
    methods: {
      change () {
        /**
         * A change event, fired after the value has been changed
         *
         * @event change
         * @type {string | number}
         */

        return this.$AppCheckboxGroup ?
          this.$AppCheckboxGroup.change(this.nextChecked)
        : this.$emit('change', this.nextChecked)
      }
    }
  }
</script>