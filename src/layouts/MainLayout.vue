<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="justify-between">
        <q-toolbar-title
          v-if="!isMobile"
          :shrink="false"
          class="flex-nogrow"
        >
          <router-link to="/" class="text-grey-1 deco-none cursor-pointer courier-prime text-bold">
            The Grineer Informer
          </router-link>
        </q-toolbar-title>
        <q-btn-group
          v-if="!isMobile"
          unelevated
        >
          <q-btn
            v-for="(link, index) in menuLinks"
            :to="link.link"
            :key="index"
            target="_blank"
            type="a"
            class="no-border-radius"
            :icon="link.icon"
            :label="link.title"
          />
        </q-btn-group>
        <div v-if="!isMobile"/>
        <q-btn
          v-if="isMobile"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title
          v-if="isMobile"
          :shrink="false"
          class="text-right"
        >
          <router-link to="/" class="text-grey-1 deco-none cursor-pointer courier-prime text-bold">
            The Grineer Informer
          </router-link>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="isMobile"
      v-model="leftDrawerOpen"
      bordered
      dark
      :no-swipe-open="true"
      :no-swipe-close="true"
      :no-swipe-backdrop="true"
    >
      <q-list class="relative-position">
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>
        <q-btn
          flat
          dense
          round
          class="absolute-top-right q-mt-xs q-mr-xs"
          size=".7em"
          icon="close"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <mobileDrawer
          v-for="(link, index) in menuLinks"
          :key="index"
          v-bind="link"
          color="black"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import mobileDrawer from 'components/menus/mobileDrawer.vue'

const linksData = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  }
];

export default {
  name: 'MainLayout',
  components: { mobileDrawer },
  data () {
    return {
      leftDrawerOpen: false,
      menuLinks: linksData
    }
  },
  computed: {
    isMobile() {
      return (this.$q.screen.width <= 1023)
    }
  },
  methods: {
  }
}

</script>
