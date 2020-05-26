import Vue from 'vue';
import Vuelidate from 'vuelidate';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { abilitiesPlugin } from '@casl/vue';

import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import ArgonDashboard from './plugins/argon-dashboard';
import store from './store';
import axios from './plugins/axios';
import ability from './config/ability';

Vue.config.productionTip = false;

// Add Font-awesome icons
library.add(fas, far);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(ArgonDashboard);
Vue.use(Vuelidate);
Vue.use(axios);
Vue.use(abilitiesPlugin, ability.guest);

store.dispatch('auth/checkLogin');

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
