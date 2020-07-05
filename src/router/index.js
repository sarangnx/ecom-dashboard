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

        // if path = '/' & user is logged in
        // redirect them to their respective home pages
        if (to.path === '/') {
            const home = {
                user: '/401',
                delivery: '/orders',
                staff: '/dashboard',
                storeowner: '/dashboard',
                admin: '/admin',
                superadmin: '/admin',
                service: '/service-dashboard',
            };

            const route = home[user.usergroup] || '/';
            return router.push(route);
        }
    }

    return next();
});

router.beforeEach((to, from, next) => {
    // find routes with subject in meta
    const protectedRoutes = to.matched.filter((record) => record.meta && record.meta.subject);

    for (let route of protectedRoutes) {
        if (!router.app.$can('route', route.meta.subject)) {
            return router.push('/404');
        }
    }

    next();
});

export default router;
