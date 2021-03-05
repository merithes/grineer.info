<template>
  <q-item
    v-if="show"
    clickable
    :target="!local ? '_blank' : ''"
    :tag="!local ? 'a' : 'div'"
    :href="!local ? link : ''"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'mobileDrawer',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    },

    local: {
      type: Boolean,
      default: true
    },

    show: {
      type: Boolean,
      default: true
    }
  }
}
</script>
