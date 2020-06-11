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
            if (!stores || !stores.length) {
                commit('setStores', null);
                commit('setCurrentStore', null);
                localStorage.removeItem('stores');
                localStorage.removeItem('current');
                return;
            }
            commit('setStores', stores);
            commit('setCurrentStore', stores[0]);

            // Object has to be stringified before storing to localStorage
            localStorage.setItem('stores', JSON.stringify(stores));
            localStorage.setItem('current', JSON.stringify(stores[0]));
        },
        reload({ commit }) {
            let stores = localStorage.getItem('stores');
            stores = JSON.parse(stores);

            if (!stores || !stores.length) return;

            commit('setStores', stores);

            const current = localStorage.getItem('current');
            current ? commit('setCurrentStore', JSON.parse(current)) : commit('setCurrentStore', stores[0]);
        },
        change({ commit }, store) {
            commit('setCurrentStore', store);
        },
    },
};
