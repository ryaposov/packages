<template>
  <div
    :data-name="$NAME"
    :class="rootClasses"
  >
    <textarea
      v-if="isTextarea"
      ref="input"
      v-bind="componentProps"
      :class="componentClasses"
      class="app-border app-color-border-2 app-rounded-4 app-h-36 app-px-16
        app-text-14 app-leading-20 app-color-text-1"
      @change="$emit('change', $event.target.value)"
      @input="$emit('input', $event.target.value)"
      @focusout="$emit('focusout', $event.target.value)"
      @focusin="$emit('focusin', $event.target.value)"
      @keyup="$emit('keyup', $event.target.value)"
    />
    <input
      v-else
      ref="input"
      v-bind="componentProps"
      :class="componentClasses"
      spellcheck="false"
      class="app-border app-color-border-2 app-rounded-4 app-h-36 app-px-16
        app-text-14 app-leading-16 app-color-text-1 app-outline-none
        app-transition-colors app-duration-150 app-ease-in-out
        hover:app-color-border-4 focus:app-color-border-brand focus:app-shadow-input focus:app-shadow"
      @change="$emit('change', $event.target.value)"
      @input="$emit('input', $event.target.value)"
      @focusout="$emit('focusout', $event.target.value)"
      @focusin="$emit('focusin', $event.target.value)"
      @keyup="$emit('keyup', $event.target.value)"
    >
    <div v-if="icon || $slots.after">
      <slot name="after">
        <AppIcon
          v-if="icon"
          :icon="icon"
          size="20"
        />
      </slot>
    </div>
  </div>
</template>

<script>
  import AppIcon from './AppIcon.vue'

  export default {
    name: 'AppInput',
    components: {
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
      }
    },
    emits: ['input', 'change'],
    computed: {
      rootClasses () {
        return {}
      },
      componentClasses () {
        return {}
      },
      componentProps () {
        return {
          value: this.value,
          id: this.cleanName,
          name: this.cleanName,
          type: this.type,
          disabled: this.isDisabled,
          size: this.responsive ? null : 30,
          ...this.$attrs
        }
      },
      cleanName () {
        return this.$AppFormItem ? this.$AppFormItem.prop : this.name
      },
      isTextarea () {
        return this.type === 'textarea'
      },
      isDisabled () {
        return this.disabled || (this.$AppFormItem ?
          this.$AppFormItem.isDisabled
        : this.disabled)
      }
    }
  }
</script>