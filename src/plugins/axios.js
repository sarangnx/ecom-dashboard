import axios from 'axios';

export default {
    install(Vue) {
        Vue.prototype.$axios = axios;
        Vue.prototype.$axios.defaults.baseURL = process.env.VUE_APP_API_URL;
    },
};
