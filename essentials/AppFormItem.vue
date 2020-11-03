<template>
  <AppStack
    ref="root"
    :data-name="$NAME"
    :class="rootClasses"
    direction="col"
  >
    <AppStack direction="col">
      <AppText
        v-if="label"
        :for="labelId || prop"
        :text="safeLabel"
        :class="labelClasses"
        :style="labelStyles"
        tag="label"
        size="14"
        weight="regular"
        color="2"
        class="app-mb-8"
      />
      <slot />
    </AppStack>
    <AppStack
      v-if="validation"
      ref="messages"
      direction="col"
      :style="messagesStyles"
    >
      <template v-if="validation.length">
        <template v-if="typeof validation !== 'string'">
          <AppText
            v-for="(rule, i) in validation"
            :key="i"
            size="14"
            weight="regular"
            color="1"
            v-text="getValidationMessage(rule)"
          />
        </template>
        <AppText
          v-else-if="validation"
          size="14"
          weight="regular"
          color="1"
          v-text="validation"
        />
      </template>
    </AppStack>
  </AppStack>
</template>

<script>
  import get from 'lodash.get'

  import AppStack from './AppStack.vue'
  import AppText from './AppText.vue'

  export default {
    /**
   * Component to render input element with a label
   * @displayName AppFormItem
   */
    name: 'AppFormItem',
    components: {
      AppStack,
      AppText
    },
    provide () {
      return {
        $AppFormItem: this
      }
    },
    inject: {
      $AppForm: { default: null }
    },
    props: {
      /**
       * A key of model to validate form input
       */
      prop: {
        type: String,
        default: ''
      },
      /**
       * A label to be displayed with the input
       */
      label: {
        type: String,
        default: ''
      },
      /**
       * Sets the disabled state of AppInput
       */
      disabled: {
        type: Boolean,
        default: false
      },
      /**
       * An id to link label to input with [for]
       */
      labelId: {
        type: String,
        default: ''
      },
      /**
       * Position of the label:
       * `top, left, right`
       */
      labelPosition: {
        type: String,
        default: 'top',
        validator: value => ['top', 'left', 'right'].includes(value)
      },
      /**
       * Width of the label
       */
      labelWidth: {
        type: [String, Number],
        default: 180
      },
      /**
       * Error Message
       */
      error: {
        type: [String, Boolean],
        default: ''
      },
      /**
       * Flex Label
       */
      flex: {
        type: Boolean,
        default: false
      },
      /**
       * Size of the label
       */
      size: {
        type: String,
        default: 'medium',
        validator: val => ['small', 'medium'].indexOf(val) > -1
      },
    },
    data: () => ({
      focus: false,
      animate: false
    }),
    computed: {
      rootClasses () {
        return {}
      },
      labelClasses () {
        return {}
      },
      labelStyles () {
        return {
          width: this.cleanLabelWidth + 'px'
        }
      },
      messagesStyles () {
        if (this.cleanLabelPosition !== 'left' && this.cleanLabelPosition !== 'right') {
          return {}
        }

        return this.cleanLabelPosition === 'left' ? {
          paddingLeft: this.cleanLabelWidth + 'px',
          marginLeft: '10px'
        } : {
          paddingRight: this.cleanLabelWidth + 'px',
          marginRight: '10px'
        }
      },
      safeLabel () {
        return (this.isRequired ? '* ' : '') + this.label
      },
      cleanLabelPosition () {
        return this.$AppForm ? this.$AppForm.labelPosition || this.labelPosition : this.labelPosition
      },
      cleanLabelWidth () {
        return this.$AppForm ? this.$AppForm.labelWidth || this.labelWidth : this.labelWidth
      },
      isRequired () {
        return this.validations.find(item => 'required' in item && item.required)
      },
      validations () {
        return (this.$AppForm && this.$AppForm.rules[this.prop]) || []
      },
      validation () {
        if (!this.$AppForm) return []

        const value = get(this.$AppForm.model, this.prop, '')

        // If error is directly passed - show it
        if (this.error) return this.error

        // If not required && empty - do not validate
        if (!this.isRequired && value == '') return ''

        // Otherwise if error if passed from parent $AppForm - show it
        let validations = (get(this.$AppForm.validations, this.prop) || []).filter(message => !message.valid)

        const requiredValidation = validations.find(item => 'required' in item.rule)

        if (requiredValidation) validations = [requiredValidation]

        return validations
      },
      isDisabled () {
        return this.disabled || (this.$AppForm ?
          this.$AppForm.disabled
        : this.disabled)
      }
    },
    updated () {
      if (this.flex) {
        this.updateFocusOnValue()
      }
    },
    mounted () {
      if (this.flex) {
        this.$refs.root.addEventListener('focusin', this.setFocusState)
        this.$refs.root.addEventListener('focusout', this.setFocusState)

        this.updateFocusOnValue()
      }
    },
    methods: {
      updateFocusOnValue () {
        this.$nextTick(() => {
          const input = this.$refs.root.querySelector('input')
          const select = this.$refs.root.querySelector('select')
          const target = input || select

          this.focus = Boolean(target.value.length)
        })
      },
      setFocusState ($e) {
        this.animate = true
        if ($e.type === 'focusout' && $e.target.value.length) {
          return
        }

        this.focus = $e.type === 'focusin'
        setTimeout(() => this.animate = false, 4000)
      },
      getValidationMessage (rule) {
        const message = rule.rule.message
        return typeof message === 'string' ? message : message(rule)
      }
    }
  }
</script>