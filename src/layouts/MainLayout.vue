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
          <template
            v-for="(link, index) in menuLinks"
          >
            <q-btn
              v-if="link.show && link.local && !link.action"
              :to="link.link"
              :key="index"
              type="a"
              target="_blank"
              class="no-border-radius"
              :icon="link.icon"
              :label="link.title"
            />
            <q-btn
              v-else-if="link.show && link.action"
              @click="link.actionFunction()"
              :key="index"
              class="no-border-radius"
              :icon="link.icon"
              :label="link.title"
            />
            <q-btn
              v-else-if="link.show"
              :href="link.link"
              :key="index"
              type="a"
              target="_blank"
              class="no-border-radius"
              :icon="link.icon"
              :label="link.title"
            />
          </template>
        </q-btn-group>
        <q-btn
          v-if="!isMobile && this.$store.state.session.expiry < Math.floor(Date.now() / 1000)"
          to="/login"
          icon="login"
          unelevated
          flat
        >
          <q-tooltip>
            Login
          </q-tooltip>
        </q-btn>
        <q-btn-dropdown
          v-else-if="!isMobile"
          icon="person_outline"
          :label="this.$store.state.session.username"
          class="text-transform-none no-border-radius courier-prime"
          content-class="no-border-radius"
          unelevated
          flat
        >
        <div class="q-gutter-md">
          <div>
            <q-btn
              size="1em"
              class="no-border-radius full-width text-transform-none courier-prime"
              to="/user"
              unelevated
              flat
            >
              <q-icon name="contact_page" size="1.2em" class="q-mb-xs q-mr-sm"/>  Profile
            </q-btn>
          </div>
          <div>
            <q-btn
              @click="logout()"
              class="no-border-radius full-width text-transform-none courier-prime"
              unelevated
              flat
            >
              <q-icon name="logout" size="1.2em" class="q-mb-xs q-mr-sm"/> Logout
            </q-btn>
          </div>
        </div>
        </q-btn-dropdown>
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
        <template
          v-for="(link, index) in menuLinks"
        >
          <mobileDrawer :key="index" v-bind="link" color="black"/>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <transition
        appear
        mode="out-in"
        :enter-active-class="pageAnimationIn"
        :duration="{ enter: 800, leave: 0 }"
      >
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
  import jwt_decode from 'jwt-decode'
  import mobileDrawer from 'components/menus/mobileDrawer.vue'

  export default {
    name: 'MainLayout',
    components: { mobileDrawer },
    data () {
      return {
        leftDrawerOpen: false,
        checkJwtExpiryInterval: ''
      }
    },
    created() {
      this.checkJwtExpiry()
      this.checkJwtExpiryInterval = setInterval(this.checkJwtExpiry, 1000)
    },
    beforeDestroy() {
      clearInterval(this.checkJwtExpiryInterval)
    },
    computed: {
      pageAnimationIn() {
        if (
          this.$route.path === '/login' ||
          this.$route.path === '/forgot-password' ||
          this.$route.path === '/register'
        ) {
          return 'animated zoomIn'
        }
        return ''
      },
      pageAnimationOut() {
        return ''
      },
      isMobile() {
        return (this.$q.screen.width <= 1023)
      },
      menuLinks() {
        return [
          {
            show: true,
            title: 'Docs',
            caption: 'quasar.dev',
            icon: 'school',
            link: 'https://quasar.dev',
            local: false
          },
          {
            show: this.isMobile && this.$store.state.session.expiry < Math.floor(Date.now() / 1000),
            title: 'Login',
            icon: 'login',
            link: '/login',
            local: true
          },
          {
            show: this.isMobile && !(this.$store.state.session.expiry < Math.floor(Date.now() / 1000)),
            title: 'Logout',
            caption: 'Logout',
            icon: 'logout',
            action: true,
            actionFunction: this.logout
          },
        ]
      }
    },
    methods: {
      logout(expiry = false) {
        let username = this.$store.state.session.username
        this.$store.commit('session/wipe')
        this.$q.notify({
          type: 'info',
          message: expiry ? `Your login expired ${username}, you have been logged out.` : `Goodbye ${username}!`
        })
      },
      checkJwtExpiry() {
        if (this.$store.state.session.expiry > 0 && this.$store.state.session.expiry <= Math.floor(Date.now() / 1000)) {
          this.logout()
        }
      }
    }
  }
</script>
