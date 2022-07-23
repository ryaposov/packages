<template>
  <component
    :is="tag"
    :data-name="$NAME"
    :class="rootClasses"
    class="app-grid"
  >
    <slot />
  </component>
</template>

<script>
  export default {
    name: 'AppGrid',
    props: {
      tag: {
        type: String,
        default: 'div'
      },
      gap: {
        type: [String, Array],
        default: 'q-gap-0'
      },
      columns: {
        type: [String, Array],
        default: '1'
      },
      rows: {
        type: [String, Array],
        default: '1'
      },
      autoFlow: {
        type: [String, Boolean, Array],
        default: false
      },
      autoColumns: {
        type: [String, Boolean, Array],
        default: false
      },
      autoRows: {
        type: [String, Boolean, Array],
        default: false
      }
    },
    computed: {
      rootClasses () {
        return [
          this.gap,
          this.columns,
          this.rows,
          this.autoFlow || [],
          this.autoColumns || [],
          this.autoRow || [],
        ]
      }
    }
  }
</script>
