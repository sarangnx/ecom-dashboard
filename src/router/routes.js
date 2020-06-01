export default [
    {
        path: '/',
        redirect: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/layout/DashboardLayout'),
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard/Dashboard.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: '/admin',
                name: 'admin dashboard',
                component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard/AdminDashboard.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: '/orders',
                name: 'orders',
                component: () => import(/* webpackChunkName: "orders" */ '@/views/Orders/Orders.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: '/items',
                name: 'items',
                component: () => import(/* webpackChunkName: "items" */ '@/views/Items/Items.vue'),
                meta: { requiresAuth: true },
                redirect: '/items/view-items',
                children: [
                    {
                        path: 'add-item',
                        name: 'add-item',
                        component: () => import(/* webpackChunkName: "items" */ '@/views/Items/AddItem.vue'),
                    },
                    {
                        path: 'add-excel',
                        name: 'add-excel',
                        component: () => import(/* webpackChunkName: "items" */ '../views/Items/ItemTable.vue'),
                    },
                    {
                        path: 'view-items',
                        name: 'view-items',
                        component: () => import(/* webpackChunkName: "items" */ '@/views/Items/ViewItems.vue'),
                    },
                    {
                        path: '*',
                        redirect: '/404',
                    },
                ],
            },
            {
                path: '/category',
                name: 'category',
                component: () => import(/* webpackChunkName: "category" */ '@/views/Category/Index.vue'),
                meta: { requiresAuth: true },
                children: [
                    {
                        path: 'master',
                        name: 'master category',
                        component: () =>
                            import(/* webpackChunkName: "category" */ '@/views/Category/Master/Category.vue'),
                    },
                    {
                        path: 'store',
                        name: 'store category',
                        component: () =>
                            import(/* webpackChunkName: "category" */ '@/views/Category/Store/Category.vue'),
                    },
                ],
            },
            {
                path: '/notifications',
                name: 'notifications',
                component: () =>
                    import(/* webpackChunkName: "notifications" */ '@/views/Notifications/Notifications.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: '/profile',
                name: 'profile',
                component: () => import(/* webpackChunkName: "profile" */ '@/views/Users/UserProfile.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: '/users',
                name: 'users',
                component: () => import(/* webpackChunkName: "users" */ '@/views/Users/Users.vue'),
                meta: { requiresAuth: true },
            },
        ],
    },
    {
        path: '/',
        redirect: 'login',
        component: () => import(/* webpackChunkName: "auth" */ '@/layout/AuthLayout'),
        children: [
            {
                path: '/login',
                name: 'login',
                component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Login.vue'),
            },
            {
                path: '/register',
                name: 'register',
                component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Register.vue'),
            },
            {
                path: '/reset',
                name: 'reset password',
                component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Reset.vue'),
            },
        ],
    },
    {
        path: '/logout',
        name: 'logout',
        component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Logout.vue'),
    },
    {
        path: '/404',
        name: '404',
        component: () => import(/* webpackChunkName: "error" */ '@/views/404.vue'),
    },
    {
        path: '*',
        redirect: '/404',
    },
];
