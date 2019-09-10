<template>
    <svg class="ph-icon-font" aria-hidden="true">
        <use :xlink:href="iconName"></use>
    </svg>
</template>

<script>
  export default {
    name: 'IconFont',
    props: {
      iconClass: {
        type: String,
        required: true
      }
    },
    computed: {
      iconName () {
        return `#icon-${this.iconClass}`
      }
    }
  }
</script>

<style scoped>
    .ph-icon-font {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>
