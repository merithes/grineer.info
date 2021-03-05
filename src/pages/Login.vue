<template>
  <div
    id="grineerLogin"
    class="row justify-center items-center q-pt-xl"
  >
    <div class="q-px-md col-xs-12 q-mt-xl text-h5 text-center courier-prime">
      Login
    </div>
    <q-form @submit="login" class="q-px-md col-xs-12 col-sm-10 q-md-8 col-lg-6 q-mt-lg">
      <q-input v-model="username" name="username" label="Username" type="text" class="courier-prime" required/>
      <q-input v-model="password" name="password" label="Password" type="password" class="courier-prime q-mt-md" required/>
      <div class="row justify-center q-mt-xl q-col-gutter-md">
        <div class="col-auto">
          <q-btn type="a" label="I'm a big dum dum" color="primary" class="no-border-radius" to="forgot-password"/>
        </div>
        <div class="col-auto">
          <q-btn type="submit" :loading="loading" label="Login" color="primary" class="no-border-radius">
            <template v-slot:loading>
              <q-spinner-puff color="white" />
            </template>
          </q-btn>
        </div>
      </div>
    </q-form>

  </div>
</template>
<script>
  import { LOGIN } from 'assets/constants/queries.js'

  export default {
    name: "grineerLogin",
    data: () => ({
      username: "",
      password: "",
      loading: false
    }),
    methods: {
      login() {
        this.loading = true

        let username = this.username
        let password = this.password
        this.$apollo.mutate({
          mutation: LOGIN,
          variables: {
            username,
            password
          }
        }).then((result) => {
          this.$store.commit('session/userSession', result.data.login)
          let username = ''
          try {
            username = result.data.login.user.username
          } catch {
            username = ''
          }
          this.$q.notify({
            type: 'positive',
            message: `Welcome back ${username}!`
          })
          this.$router.push("/")
        }).catch((error) => {
          let errorPhrasing
          try {
            errorPhrasing = error.graphQLErrors[0].extensions.exception.data.message[0].messages[0].message
          } catch {
            errorPhrasing = "We have troubles communicating with our servers right now..."
          }
          this.$q.notify({
            type: 'negative',
            message: errorPhrasing
          })
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
</script>
