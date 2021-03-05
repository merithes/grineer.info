<template>
  <div
    id="grineerLogin"
    class="row justify-center items-center q-pt-xl"
  >
    <div class="q-px-md col-xs-12 q-mt-xl text-h5 text-center courier-prime">
      Reset your password
    </div>
    <q-form @submit="forgotPassword" class="q-px-md col-xs-12 col-sm-10 q-md-8 col-lg-6 q-mt-lg">
      <q-input v-model="email" name="email" label="E-mail" type="email" class="courier-prime" required/>
      <div class="row justify-center q-mt-xl">
        <q-btn type="submit" :loading="loading" label="Confirm" color="primary" class="no-border-radius">
          <template v-slot:loading>
            <q-spinner-puff color="white" />
          </template>
        </q-btn>
      </div>
    </q-form>

  </div>
</template>
<script>
  import gql from 'graphql-tag'
  export default {
    name: "grineerLogin",
    data: () => ({
      email: "",
      psswd: "",
      loading: false,
    }),
    methods: {
      forgotPassword() {
        this.loading = true
        this.success = false

        let email = this.email

        this.$apollo.mutate({
          mutation: gql`
            mutation forgotPassword ($email: String!) {
              forgotPassword( email: $email ) {
                ok
              }
            }`,
          variables: {
            email
          }
        }).then((result) => {
          this.$q.notify({
            type: 'positive',
            message: 'A reset password link has been sent to your email adress.'
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
      }
    }
  }
</script>
