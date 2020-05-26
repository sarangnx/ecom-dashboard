const decode = require('jwt-decode');

export default {
    namespaced: true,
    // State stores jwtToken in local storeage
    state: {
        token: null,
        user: null,
        apiUrl: null,
        serverUrl: null,
    },
    mutations: {
        setApiUrl(state, apiUrl) {
            state.apiUrl = apiUrl;
        },
        setServerUrl(state, serverUrl) {
            state.serverUrl = serverUrl;
        },
        setToken(state, token) {
            state.token = token;
        },
        setUser(state, user) {
            state.user = user;
        },
        logout(state) {
            state.user = null;
            state.token = null;
        },
    },
    getters: {
        isLoggedIn(state) {
            return state.token && state.user ? true : false;
        },
        getToken(state) {
            return state.token;
        },
        apiUrl(state) {
            return state.apiUrl;
        },
        serverUrl(state) {
            return state.serverUrl;
        },
        getUser(state) {
            return state.user;
        },
    },
    actions: {
        async login({ commit, state }, userdata) {
            try {
                const response = await this._vm.$axios({
                    method: 'post',
                    url: '/auth/login',
                    data: userdata,
                });

                if (response.data) {
                    const user = response.data.user;

                    // Store the token to local storage
                    localStorage.setItem('authToken', response.data.token);

                    // Set authentication headers for future requests
                    this._vm.$axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;

                    // set states token and user
                    commit('setToken', response.data.token);
                    commit('setUser', user);
                }
            } catch (err) {
                if (err.response && err.response.data && err.response.data.error) {
                    this._vm.$error(err.response.data.error.message);
                }
                commit('setToken', null);
                localStorage.removeItem('authToken');
                commit('setUser', null);
                delete this._vm.$axios.defaults.headers.common.Authorization;
            }
        },
        async logout({ commit }) {
            try {
                commit('logout');
                await localStorage.removeItem('authToken');
                delete this._vm.$axios.defaults.headers.common.Authorization;
            } catch (err) {}
        },
        checkLogin({ getters, dispatch, commit }) {
            //  Check whether user is logged in after reopening browser/tab.
            try {
                const token = getters.getToken || localStorage.getItem('authToken');
                const user = decode(token);

                const expiry = new Date() - new Date(user.exp * 1000);

                if (expiry <= 0) {
                    this._vm.$axios.defaults.headers.common.Authorization = `Bearer ${token}`;
                    commit('setToken', token);
                    commit('setUser', user);
                    localStorage.setItem('authToken', token);
                } else {
                    throw new Error('Token expired.');
                }
            } catch (err) {
                dispatch('logout');
            }
        },
        checkToken({ getters }) {
            // Check for token and its validity
            try {
                const token = getters.getToken;
                const user = decode(token);

                const expiry = new Date() - new Date(user.exp * 1000);

                if (expiry <= 0) {
                    return true;
                }

                return false;
            } catch {
                return false;
            }
        },
    },
};
