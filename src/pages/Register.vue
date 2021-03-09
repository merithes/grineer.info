<template>
  <div
    id="grineerRegister"
    class="row justify-center items-center q-pt-xl"
  >
    <div class="q-px-md col-xs-12 q-mt-xl text-h5 text-center courier-prime">
      Login
    </div>
    <q-form @submit="register" class="q-px-md col-xs-12 col-sm-10 q-md-8 col-lg-6 q-mt-lg">
      <div class="row q-col-gutter-xl">
        <div class="col-xs-12 col-sm-6">
          <q-input v-model="username" name="username" label="Username" type="text" class="courier-prime" required/>
        </div>
        <div class="col-xs-12 col-sm-6">
          <q-input v-model="email" name="username" label="Email" type="email" class="courier-prime" required/>
        </div>
        <div class="col-xs-12 col-sm-6">
          <q-input v-model="password" name="password" label="Password" :type="showPassword ? 'text' : 'password'" class="courier-prime q-mt-md" required>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
        </div>
        <div class="col-xs-12 col-sm-6">
          <q-input v-model="c_password" name="password" label="Confirm Password" :type="showConfirmPassword ? 'text' : 'password'" class="courier-prime q-mt-md" required>
            <template v-slot:append>
              <q-icon
                :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </q-input>
        </div>
        <div class="col-xs-12 text-center">
        </div>
      </div>
      <div class="text-center q-mt-lg">
        <q-btn type="submit" :loading="loading" :disabled="password != c_password" label="Register" color="primary" class="no-border-radius">
          <q-tooltip v-if="password != c_password">
            Your passwords don't match
          </q-tooltip>
          <template v-slot:loading>
            <q-spinner-puff color="white" />
          </template>
        </q-btn>
      </div>
      <div class="text-center q-mt-lg q-gutter-md">
        <q-btn type="a" label="Login" color="white" class="no-border-radius text-caption" to="login" dense flat/>
      </div>
    </q-form>
  </q-form>

  </div>
</template>
<script>
  import { REGISTER } from 'assets/constants/queries.js'

  export default {
    name: "grineerRegister",
    data: () => ({
      username: "",
      email: "",
      password: "",
      c_password: "",
      loading: false,
      showPassword: false,
      showConfirmPassword: false,
    }),
    methods: {
      register() {
        this.loading = true

        let username = this.username
        let email = this.email
        let password = this.password
        this.$apollo.mutate({
          mutation: REGISTER,
          variables: {
            username,
            email,
            password
          }
        }).then((result) => {
          this.$store.commit('session/userSession', result.data.register)
          let username = ''
          try {
            username = result.data.register.user.username
          } catch {
            username = ''
          }
          this.$q.notify({
            type: 'positive',
            message: `Welcome ${username}!`
          })
          this.$router.push("/")
        }).catch((error) => {
          this.$q.notify({
            type: 'negative',
            message: 'We are unable to process your registration.'
          })
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
</script>
