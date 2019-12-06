export const indexHtml = (appName) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title>${appName}</title>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but ${appName} doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
`;

const pascalCaseToKebabCase = (str) => {
	return str.replace(/[A-Z]/g, (x) => '-' + x)
		.replace(/^-/, '')
		.toLowerCase();
};

export const appVue = (mainComponentName, initialData) => `
<template>
  <div id="app">
    <${pascalCaseToKebabCase(mainComponentName)} />
  </div>
</template>

<script>
import ${mainComponentName} from './components/${mainComponentName}.vue';
export default {
  name: 'app',
  components: {
      '${pascalCaseToKebabCase(mainComponentName)}': ${mainComponentName}
  },
  data: () => (${JSON.stringify(initialData)})
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
`;

export const mainComponentVue = (mainComponentName) => `
<template>
  <!--change this template to suit your main component-->
  <div>
    <h1>${mainComponentName}</h1>
    <h2>{{greet}}</h2>
  </div>
</template>
<script>
export default {
    name: '${mainComponentName}',
    props: {
      // insert component properties here
    },
    computed: {
        greet() { return this.$store.state.greet; }
    },
    mounted() {
        this.$store.dispatch('loadGreeting');
    }
};
</script>
`;

export const packageJson = (projectName) => JSON.stringify({
	'name': projectName,
	'version': '1.0.0',
	'description': '',
	'main': 'index.js',
	'scripts': {
		'test': 'echo "Error: no test specified" && exit 1',
		'serve': 'vue-cli-service serve',
		'build': 'vue-cli-service build',
		'lint': 'vue-cli-service lint'
	},
	'keywords': [],
	'author': '',
	'license': 'UNLICENSED'
}, null, 4);

export const mainJs = () => `
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import makeShep from '@lmig/shep';

const serviceUrl = 'http://localhost:3000/api/v1/example/:id'

Vue.config.productionTip = false;
Vue.use(Vuex);
const shep = makeShep();

const store = new Vuex.Store({
    state: shep.registerUrl(serviceUrl)({ id: 0, greet: ''}),
    mutations: {
        setGreeting: (state, greeting) => {
            state.greet = greeting;
        }
    },
    actions: {
        loadGreeting: ({commit, state}) => {
            shep.refresh(state).then((x) => commit('setGreeting', x.greet));
        }
    }
});

new Vue({
  render: h => h(App),
  store
}).$mount('#app');
`;
