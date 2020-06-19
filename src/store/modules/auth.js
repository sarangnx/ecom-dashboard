import decode from 'jwt-decode';
import ability from '@/config/ability';

export default {
    namespaced: true,
    // State stores jwtToken in local storeage
    state: {
        token: null,
        user: null,
        apiUrl: null,
        serverUrl: null,
        verified: false,
    },
    mutations: {
        setApiUrl(state, apiUrl) {
            state.apiUrl = apiUrl;
        },
        setVerified(state, verified) {
            state.verified = verified;
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
        isVerified(state) {
            return state.verified;
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
        async login({ commit, dispatch }, userdata) {
            try {
                const response = await this._vm.$axios({
                    method: 'post',
                    url: '/auth/login',
                    data: userdata,
                });

                if (response.data) {
                    const user = response.data.user;

                    // save associated stores
                    if (user.stores && user.stores.length) {
                        dispatch('stores/init', user.stores, { root: true });
                        delete user.stores;
                    } else {
                        // remove stores in localstorage
                        dispatch('stores/init', null, { root: true });
                    }

                    // Store the token to local storage
                    localStorage.setItem('authToken', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));

                    // Set authentication headers for future requests
                    this._vm.$axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;

                    // set states token and user
                    commit('setToken', response.data.token);
                    commit('setUser', user);
                    commit('setVerified', user.verified);

                    // update ability with new usergroup rules
                    if (user.usergroup) {
                        this._vm.$ability.update(ability[user.usergroup]);
                    }
                }
            } catch (err) {
                if (err.response && err.response.data && err.response.data.error) {
                    this._vm.$error(err.response.data.error.message);
                }
                commit('setToken', null);
                localStorage.removeItem('authToken');

                commit('setUser', null);
                localStorage.removeItem('user');
                delete this._vm.$axios.defaults.headers.common.Authorization;
            }
        },
        verify({ commit }, verified) {
            commit('setVerified', verified);
        },
        logout({ commit }) {
            try {
                commit('logout');
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');

                // remove stores in localstorage
                dispatch('stores/init', null, { root: true });
                delete this._vm.$axios.defaults.headers.common.Authorization;
            } catch (err) {}
        },
        checkLogin({ getters, dispatch, commit }) {
            //  Check whether user is logged in after reopening browser/tab.
            try {
                const token = getters.getToken || localStorage.getItem('authToken');
                const tokenDecoded = decode(token);

                const expiry = new Date() - new Date(tokenDecoded.exp * 1000);

                if (expiry <= 0) {
                    this._vm.$axios.defaults.headers.common.Authorization = `Bearer ${token}`;
                    commit('setToken', token);

                    const userString = localStorage.getItem('user') || null;
                    const user = JSON.parse(userString);

                    commit('setUser', user);
                    commit('setVerified', user.verified);
                    dispatch('stores/reload', null, { root: true });

                    // update ability with new usergroup rules
                    if (user.usergroup) {
                        this._vm.$ability.update(ability[user.usergroup]);
                    }
                } else {
                    throw new Error('Token expired.');
                }
            } catch (err) {
                this._vm.$error('Login Again', { title: 'Session Expired' });
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
