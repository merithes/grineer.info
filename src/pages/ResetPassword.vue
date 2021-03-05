<template>
  <div
    id="grineerLogin"
    class="row justify-center items-center q-pt-xl"
  >
    <div class="q-px-md col-xs-12 q-mt-xl text-h5 text-center courier-prime">
      Create a new password
    </div>
    <q-form @submit="createPassword" class="q-px-md col-xs-12 col-sm-10 q-md-8 col-lg-6 q-mt-lg">
      <q-input v-model="password" name="password" label="Your new password" type="password" class="courier-prime" required/>
      <q-input v-model="confirmPassword" name="password" label="Confirm your password" type="password" class="courier-prime q-mt-md" required/>
      <div class="row justify-center q-mt-xl q-col-gutter-md">
        <div class="col-auto">
          <q-btn type="submit" label="Confirm" color="primary" class="no-border-radius"/>
        </div>
      </div>
    </q-form>

  </div>
</template>
<script>
  import gql from 'graphql-tag'
  export default {
    name: "grineerLogin",
    created: function() {
      if (typeof this.$route.query.code !== 'string' || !this.$route.query.code.length) {
        this.$router.push('/')
      }
    },
    data: () => ({
      password: "",
      confirmPassword: "",
      username: "",
      loading: false
    }),
    methods: {
      createPassword() {
        this.loading = true

        let password = this.password
        let password2 = this.confirmPassword
        let code = this.$route.query.code

        if (typeof password === 'string' && password.length >= 8 && password === password2) {
          this.$apollo.mutate({
            mutation: gql`
            mutation resetPassword ($password: String!, $password2: String!, $code: String!) {
              resetPassword( password: $password, passwordConfirmation: $password2, code: $code ) {
                jwt
                user { id username }
              }
            }`,
            variables: {
              password,
              password2,
              code
            }
          }).then((result) => {
            let username
            try {
              username = result.data.resetPassword.user.username
            } catch {
              username = ''
            }
            this.$q.notify({
              type: 'positive',
              message: `You have successfully  reset your password, and are now logged in. Welcome back ${username}.`
            })
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
        } else if (typeof password !== 'string') {
          this.$q.notify({
            type: 'negative',
            message: 'You might want to input a password to be set.'
          })
        } else if (password.length < 8) {
          this.$q.notify({
            type: 'negative',
            message: 'You need a safer password.'
          })
        } else if (password !== password2) {
          this.$q.notify({
            type: 'negative',
            message: 'Your passwords do not match.'
          })
        }
      }
    }
  }
</script>
