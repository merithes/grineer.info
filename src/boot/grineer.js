// import something here

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files

/*
export default {
    name: 'login',
    methods: {
        login: function () {
          this.$http.post('http://somehost/user/login', {
            password: this.password,
            email: this.email
          }).then(function (response) {
            if (response.status === 200 && 'token' in response.body) {
              this.$session.start()
              this.$session.set('jwt', response.body.token)
              Vue.http.headers.common['Authorization'] = 'Bearer ' + response.body.token
              this.$router.push('/panel/search')
            }
          }, function (err) {
            console.log('err', err)
          })
        }
    }
}
*/

import VueSession from 'vue-session'

export default async ( { Vue}) => {
  // something to do
  Vue.prototype.$strapiURL = "https://strapi.grineer.info"
  Vue.prototype.$removeMD = require('remove-markdown')
  var vueAwesomeCountdown = require('vue-awesome-countdown').default

  Vue.use(vueAwesomeCountdown)
  let sessionOptions = {
    persist: true
  }
}
