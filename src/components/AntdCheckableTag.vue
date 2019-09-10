<template>
  <a-tag v-if="disabled" :color="typeColor" style="cursor:not-allowed;">{{text}}</a-tag>
  <a-tag v-else :color="typeColor" @click="handleClick">{{text}}</a-tag>
</template>

<script>
  export default {
    name: 'AntdCheckableTag',
    data () {
      return {}
    },
    props: {
      disabled: {
        type: Boolean,
        default () {
          return false
        }
      },
      text: {
        type: String,
        default () {
          return ''
        }
      },
      passColor: {
        type: String,
        default () {
          return '#87d068'
        }
      },
      failColor: {
        type: String,
        default () {
          return '#f50'
        }
      },
      initialColor: {
        type: String,
        default () {
          return ''
        }
      },
      type: {
        type: String,
        default () {
          return 'initial'  // ''为默认值，'pass' 为成功， 'fail' 为失败
        }
      }
    },
    computed: {
      typeColor () {
        switch (this.type) {
          case 'pass':
            return this.passColor;
          case 'fail':
            return this.failColor;
          case 'initial':
            return this.initialColor;
          default:
            return ''
        }
      }
    },
    methods: {
      handleClick () {
        this.$emit('change')
      }
    }
  }
</script>
