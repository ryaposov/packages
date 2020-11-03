<template>
  <form
    ref="form"
    class="qform"
    novalidate
    @submit="$emit('submit', $event)"
  >
    <slot />
  </form>
</template>

<script>
  import get from 'lodash.get'
  import set from 'lodash.set'
  import validationRules from './validationRules'

  export default {
    /**
     * Component for a form
     * @displayName AppForm
     */
    name: 'AppForm',
    provide () {
      return {
        $AppForm: this
      }
    },
    props: {
      /**
       * Model object of the form, to map validation rules to fields
       */
      model: {
        type: Object,
        default: () => ({})
      },
      /**
       * An object of validation rules, where keys map to fields in the form
       */
      rules: {
        type: Object,
        default: () => ({}),
        validator: value => {
          const check = Object.values(value).every(item => Array.isArray(item))
          if (!check) console.warn('AppForm: Ruleset shoud be an array')
          return Object.values(value).every(item => Array.isArray(item))
        }
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
        default: 140
      },
      /**
       * Disables all inputs
       */
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      validations: {}
    }),
    computed: {
      rulesMapped () {
        const rules = {}

        for (let key in this.rules) {
          // rules[key] = this.rules[key]
          rules[key] = this.rules[key].reduce((a, b) => {
            if (Array.isArray(b.trigger)) {
              b.trigger.forEach(trigger => a.push({ ...b, trigger }))
            } else {
              a.push(b)
            }

            return a
          }, [])
        }

        return rules
      },
      listeners () {
        return Object.values(this.rulesMapped)
          .reduce((a, b) => {
            a = a.concat(b)

            return a
          }, [])
          .map(item => item.trigger)
          .reduce((a, b) => {
            if (!a.includes(b)) a.push(b)

            return a
          }, [])
      }
    },
    mounted () {
      // Set listeners
      this.setListeners()
    },
    methods: {
      setListeners () {
        this.listeners.map(event => this.$el.addEventListener(event, this.serveEvents, false))
      },
      serveEvents ($e) {
        // Get rulesets of this rule name
        const rules = get(this.rulesMapped, $e.target.name) || []

        // Check for rules that also match event type
        const rulesWithType = rules.filter(rule => rule.trigger === $e.type)

        // Return if no rulesets found
        if (!rules.length || !rulesWithType.length) return

        // Validate found rulesets
        this.validateEvent(rulesWithType, $e)
          .then(result => {
            set(this.validations, $e.target.name, result)
            this.validations = { ...this.validations }
          })
      },
      filterRuleProps (rule) {
        return Object.keys(rule)
          .filter(item => !['message', 'trigger'].includes(item))
          .filter(item => item in validationRules || item === 'validator')
      },
      getValidationMessage (rule) {
        const message = rule.rule.message
        return typeof message === 'string' ? message : message(rule)
      },
      validateFieldRule (rule, value, set) {
        let ruleTypes = this.filterRuleProps(rule)

        return Promise
          // Mapping over rules, support custom validator functions
          .all(ruleTypes.map(func => ('validator' in rule ? rule.validator : validationRules[func])(rule, value)))
          .then(results => {
            const isRequired = set.find(item => 'required' in item && item.required)
            const valid = (value === '' && !isRequired) || results.every(item => item)
            const error = !valid ? this.getValidationMessage({ rule, valid, value }) : undefined

            return { rule, valid, value, error }
          })
          .catch(console.warn)
      },
      validateRuleSet (set, value) {
        return Promise.all(set.map(rule => this.validateFieldRule(rule, value, set)))
          .catch(console.warn)
      },
      validateEvent (rules, $e) {
        // Convert bool values from string
        if (['true', 'false'].indexOf($e.target.value) > -1) {
          $e.target.value = Boolean($e.target.value === 'true')
        }

        return this.validateRuleSet(rules, $e.target.value)
      },
      validateField (field) {
        return this.validateRuleSet(this.rulesMapped[field], get(this.model, field))
          .then(ruleset => {
            set(this.validations, field, ruleset)
            this.validations = { ...this.validations }

            const isValid = ruleset.every(rule => rule.valid)
            const errors = [ruleset].map(ruleset => ruleset.map(rule => rule.error).filter(error => error)).reduce((a, b) => {
              a = a.concat(b)
              return a
            }, [])

            return { isValid, errors }
          })
      },
      validate (callback = (val => val)) {
        const fields = Object.keys(this.rulesMapped)

        return Promise.all(fields.map(field => this.validateRuleSet(this.rulesMapped[field], get(this.model, field))))
          .then(result => {
            fields.forEach((field, i) => set(this.validations, field, result[i]))
            this.validations = { ...this.validations }

            const isValid = result.every(ruleset => ruleset.every(rule => rule.valid))
            const errors = result.map(ruleset => ruleset.map(rule => rule.error).filter(error => error)).reduce((a, b) => {
              a = a.concat(b)
              return a
            }, [])

            return { isValid, errors }
          })
          .then(({ isValid, errors}) => callback(isValid, errors))
      },
      reset () {
        this.validations = {}
      },
      submit ($e) {
        this.$refs.form.submit()
      }
    }
  }
</script>