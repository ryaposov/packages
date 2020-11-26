<template>
  <teleport to="body">
    <div
      v-if="mounted"
      :key="`app-modal-${anchor}`"
      class="app-fixed app-top-0 app-left-0 app-z-50 app-w-full app-h-full"
    >
      <div
        ref="scrollview"
        class="app-w-full app-h-full app-absolute app-top-0 app-left-0
            app-overflow-x-auto app-overflow-y-auto"
      >
        <div
          class="app-fixed app-w-full app-top-0 app-left-0 app-h-full app-color-bg-opposite
              app-transition-opacity app-duration-300 app-ease-in-out app-will-change"
          :class="darkenerClasses"
          @click="close"
        />
        <AppStack
          align="start"
          class="app-h-full"
        >
          <div
            class="app-relative app-mx-auto app-color-bg-1 app-transition app-duration-300 app-will-change app-rounded-4"
            :class="contentClasses"
          >
            <button
              v-if="closeButton"
              class="app-sticky app-top-0 app-block app-text-text-300 app-ml-auto app-p-20 app-color-bg-transparent
                  app-transition app-duration-300 app-ease-in-out app-transform
                  md:hover:app-scale-125 hover:app-text-text-400 md:app-p-28"
              @click="close"
            >
              <AppIcon
                :size="['20px', '28px']"
                icon="remove"
              />
            </button>
            <slot
              :displayed="displayed"
              :close="close"
            />
          </div>
        </AppStack>
      </div>
    </div>
  </teleport>
</template>

<script>
  import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock/lib/bodyScrollLock.es6'

  import AppIcon from './AppIcon.vue'
  import AppStack from './AppStack.vue'

  // The duration of darkener to transition (500ms) + content with delay of 300ms
  const COMPLETE_ANIMATION_DURATION = 600

  export default {
    name: 'AppModal',
    components: {
      AppIcon,
      AppStack
    },
    model: {
      prop: 'visible',
      event: 'change'
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      anchor: {
        type: String,
        default: ''
      },
      position: {
        type: String,
        default: 'top',
        validator: val => ['top', 'center', 'bottom'].includes(val)
      },
      offset: {
        type: String,
        default: '200'
      },
      maxWidth: {
        type: String,
        default: '800'
      },
      closeButton: {
        type: Boolean,
        default: true
      }
    },
    emits: ['change', 'opening', 'closing', 'opened', 'closed'],
    data: () => ({
      mounted: false,
      displayed: false,
      state: 'idle',
      windowHeight: null
    }),
    computed: {
      darkenerClasses () {
        return [
          ...{
            true: [
              'app-opacity-40',
              'app-delay-0'
            ],
            false: [
              'app-opacity-0',
              'app-delay-300'
            ]
          }[this.displayed]
        ]
      },
      contentClasses () {
        return [
          ...{
            top: [
              'md:app-my-200'
            ],
            center: [
              'md:app-my-auto'
            ],
            bottom: [
              'md:app-my-200'
            ],
          }[this.position],
          ...{
            true: [
              'app-opacity-100',
              'app-delay-200',
              'app-ease-in-out'
            ],
            false: [
              'app-opacity-0',
              'app-transform',
              'app-translate-y-40',
              'app-delay-0',
              'app-ease-in-out'
            ]
          }[this.displayed]
        ]
      }
    },
    watch: {
      state (newValue) {
        let event = null

        this.$emit(newValue)

        if (newValue === 'opened' || newValue === 'closed') {
          this.$emit('change', newValue === 'opened' ? true : false)
        }
      },
      visible (newValue) {
        // React to visible prop only if no anchor
        if (!this.anchor) newValue ? this.open() : this.close()
      },
    },
    created () {
      // Register hash change listeners
      if (this.anchor) this.registerPopStateListeners()

      // Open page if hash is in the url or visible prop is passed
      if (this.checkHash(window.location.hash) || this.visible) this.open()
    },
    methods: {
      registerPopStateListeners () {
        // Register new onpopstate handler
        if (!window.onpopstateHandlers) window.onpopstateHandlers = {}
    
        window.onpopstateHandlers[this.anchor] = this.onPopState
    
        if (!window.onpopstate) {
          // Fire all registered handlers on popstate
          window.onpopstate = $e => {
            Object.values(window.onpopstateHandlers).forEach(handler => handler($e))
          }
        }
      },
      onPopState ($e) {
        if (this.state === 'closing') {
          return
        }

        if (this.state === 'opened') {
          return this.close()
        }

        if (this.checkHash($e.target.location.hash) !== this.mounted) {
          // Mounts the modal wrapper
          this.mounted = this.checkHash($e.target.location.hash)

          // Show modal components: darkener and content after main wrapper is rendered
          // and emit events like everything is ready and completerly rendered in COMPLETE_ANIMATION_DURATION
          setTimeout(() => {
            if (this.mounted) this.displayed = true
          }, 100)
        }
      },
      open () {
        return new Promise((resolve, reject) => {
          this.mounted = true
          this.state = 'opening'

          this.$nextTick(() => {
            if (this.mounted) {
              disableBodyScroll(this.$refs.scrollview)
              this.displayed = true

              setTimeout(() => {
                this.state = 'opened'
                
                resolve()
              }, COMPLETE_ANIMATION_DURATION)
            }
          })
        })
      },
      close () {
        return new Promise((resolve, reject) => {
          clearAllBodyScrollLocks()
          
          const scrollTopPosition = window.scrollY
          this.displayed = false
          this.state = 'closing'

          setTimeout(() => {
            if (this.anchor && this.checkHash(window.location.hash)) {
              window.location.hash = ''
              document.querySelector('html').scrollTop = scrollTopPosition
            }
            
            this.mounted = false
            this.state = this.mounted ? 'opened' : 'closed'

            resolve()
          }, COMPLETE_ANIMATION_DURATION)
        })
      },
      checkHash (hash) {
        return hash.replace('#', '') === this.anchor
      }
    }
  }
</script>