import Vue from 'vue';
import Vuelidate from 'vuelidate';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import ArgonDashboard from './plugins/argon-dashboard';
import store from './store';
import axios from './plugins/axios';

Vue.config.productionTip = false;

// Add Font-awesome icons
library.add(fas, far);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(ArgonDashboard);
Vue.use(Vuelidate);
Vue.use(axios);

store.dispatch('login/checkLogin');

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');