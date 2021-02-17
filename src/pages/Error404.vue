<template>
  <div class="fullscreen bg-dark text-white text-center q-pa-md flex flex-center alert-contour">
    <div>
      <div class="text-h1 courier-prime bg-med-dark-overlay inline-block q-pa-sm q-mb-lg">
        [NO CONTENT]
      </div>

      <div class="text-h4 courier-prime">
        Any repeated attempt will be reported to your superior officer.
      </div>

      <div class="text-subtitle1 courier-prime text-grey-6 q-mt-sm">
        - ACTIVITY LOGGED AT {{ eventDate.toISOString() }} -
      </div>

      <q-btn
        class="q-mt-xl no-border-radius text-subtitle1 courier-prime small-line q-px-lg"
        color="light-dark-overlay"
        text-color="primary"
        unelevated

        to="/"
        label="[Go Back]"
        no-caps
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Error404',
    data() {
      return {
        eventDate: new Date()
      }
    }
  }
</script>
