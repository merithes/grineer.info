// import something here

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files


export default async ( { Vue}) => {
  // something to do
  Vue.prototype.$strapiURL = "https://strapi.grineer.info";
  Vue.prototype.$removeMD = require('remove-markdown');
  var vueAwesomeCountdown = require('vue-awesome-countdown').default;

  Vue.use(vueAwesomeCountdown);
}
