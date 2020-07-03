import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import routes from './routes';

Vue.use(Router);

const router = new Router({
    linkExactActiveClass: 'active',
    mode: 'history',
    routes: [...routes],
});

/**
 * This navigation gruad is used for restricting access
 * to routes requiring authentication.
 */
router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta && record.meta.requiresAuth)) {
        // Check if a user is logged in
        const loggedIn = await store.dispatch('auth/checkToken');

        if (!loggedIn) {
            return next('/login');
        }

        // if user is store owner check if phone is verified.
        const verified = await store.getters['auth/isVerified'];
        const user = await store.getters['auth/getUser'];

        if (user.usergroup === 'storeowner' && !verified) {
            const route = user && user.phone ? `/verify?phone=${user.phone}` : '/verify';
            return router.push(route);
        }
    }

    return next();
});

export default router;
