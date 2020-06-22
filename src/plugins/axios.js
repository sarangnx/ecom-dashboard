import axios from 'axios';
import router from '@/router';

export default {
    install(Vue) {
        Vue.prototype.$axios = axios;
        Vue.prototype.$axios.defaults.baseURL = process.env.VUE_APP_API_URL;
        Vue.prototype.$axios.interceptors.response.use(
            function (response) {
                return response;
            },
            function (error) {
                if (error.response.status === 401) {
                    router.push('/login').catch(() => {});
                }

                return Promise.reject(error);
            }
        );
    },
};
