<template>
  <div
    id="showBanner"
    v-if="typeof banner !== 'undefined' && typeof banner.url === 'string' && banner.url.length"
    class="col-xs-12 bg-med-dark-overlay"
    :class="{
      'q-mb-md': !noMargin && $q.screen.width < 992 && $q.screen.width >= 600,
      'q-mb-xl': !noMargin && $q.screen.width >= 992,
    }"
  >
    <q-img
      :src="$strapiURL + banner.url"
      width="100%"
      :height="$q.screen.width > 991 ? '330px' : ''"
      :ratio="$q.screen.width <= 991 ? $q.screen.width <= 475 ? 4.5 : 6 : ''"
      position="center center"
      :img-style="{
        backgroundSize: $q.screen.width > 991 ? '1920px' : '100%',
        boxShadow: '0 -1vw 1vw -1vw rgba(0, 0, 0, 0.7) inset'
      }"
    >
      <template v-slot:loading>
        <div class="full-height full-width row justify-center items-center">
          <q-spinner-rings color="accent" size="80%"/>
        </div>
      </template>
    </q-img>
  </div>
</template>
</script>

<script>
  export default {
    name: 'showBanner',
    data () {
      return {
      }
    },
    props: {
      'banner': undefined,
      'noMargin': {
        type: Boolean,
        default: false
      }
    },
    methods: {
    },
    created () {
    }
  }
</script>
