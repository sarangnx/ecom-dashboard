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
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        const loggedIn = await store.dispatch('auth/checkToken');

        if (!loggedIn) {
            return next('/login');
        }
    }
    return next();
});

export default router;
