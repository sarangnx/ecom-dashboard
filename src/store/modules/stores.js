export default {
    namespaced: true,
    state: {
        stores: null,
        current: null,
    },
    mutations: {
        setStores(state, stores) {
            state.stores = stores;
        },
        setCurrentStore(state, store) {
            state.current = store;
        },
    },
    getters: {
        stores(state) {
            return state.stores;
        },
        current(state) {
            return state.current;
        },
    },
    actions: {
        init({ commit }, stores) {
            commit('setStores', stores);
            localStorage.setItem('stores', stores);
            commit('setCurrentStore', stores[0]);
            localStorage.setItem('current', stores[0]);
        },
        reload({ commit }) {
            const stores = localStorage.getItem('stores');
            commit('setStores', stores);
            const current = localStorage.getItem('current');
            current ? commit('setCurrentStore', current) : commit('setCurrentStore', stores[0]);
        },
        change({ commit }, store) {
            commit('setCurrentStore', store);
        },
    },
};
