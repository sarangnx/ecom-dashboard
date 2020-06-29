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
                path: '/quick-orders',
                name: 'quick orders',
                component: () => import(/* webpackChunkName: "orders" */ '@/views/ImageOrders/Orders.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: '/items',
                name: 'items',
                component: () => import(/* webpackChunkName: "items" */ '@/views/Items/Index.vue'),
                meta: { requiresAuth: true },
                children: [
                    {
                        path: 'master',
                        name: 'master items',
                        component: () => import(/* webpackChunkName: "items" */ '@/views/Items/Master/Items.vue'),
                    },
                    {
                        path: 'excel',
                        name: 'excel',
                        component: () => import(/* webpackChunkName: "items" */ '@/views/Items/Master/Excel.vue'),
                    },
                    {
                        path: 'add-items',
                        name: 'add items',
                        component: () => import(/* webpackChunkName: "items" */ '@/views/Items/Store/AddItems.vue'),
                    },
                    {
                        path: 'store',
                        name: 'store items',
                        component: () => import(/* webpackChunkName: "items" */ '@/views/Items/Store/StoreItems.vue'),
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
                path: '/banners',
                name: 'banners',
                component: () => import(/* webpackChunkName: "notifications" */ '@/views/Banner/Banner.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: '/services',
                name: 'services',
                component: () => import(/* webpackChunkName: "category" */ '@/views/Services/Index.vue'),
                meta: { requiresAuth: true },
                children: [
                    {
                        path: 'manage-services',
                        name: 'manage services',
                        component: () =>
                            import(/* webpackChunkName: "category" */ '@/views/Services/Pages/Services.vue'),
                    },
                ],
            },
            // {
            //     path: '/notifications',
            //     name: 'notifications',
            //     component: () =>
            //         import(/* webpackChunkName: "notifications" */ '@/views/Notifications/Notifications.vue'),
            //     meta: { requiresAuth: true },
            // },
            // {
            //     path: '/users',
            //     name: 'users',
            //     component: () => import(/* webpackChunkName: "users" */ '@/views/Users/Users.vue'),
            //     meta: { requiresAuth: true },
            // },
            {
                path: '/settings',
                component: () => import(/* webpackChunkName: "settings" */ '@/views/Settings/Index.vue'),
                meta: { requiresAuth: true },
                children: [
                    {
                        path: '',
                        name: 'settings',
                        component: () => import(/* webpackChunkName: "settings" */ '@/views/Settings/Settings.vue'),
                    },
                    {
                        path: 'stores',
                        name: 'settings / stores',
                        component: () =>
                            import(/* webpackChunkName: "settings" */ '@/views/Settings/Pages/Stores/Stores.vue'),
                    },
                    {
                        path: 'profile',
                        name: 'settings / profile',
                        component: () =>
                            import(/* webpackChunkName: "settings" */ '@/views/Settings/Pages/Profile/Profile.vue'),
                    },
                    {
                        path: 'password',
                        name: 'settings / change password',
                        component: () =>
                            import(/* webpackChunkName: "settings" */ '@/views/Settings/Pages/Profile/Password.vue'),
                    },
                ],
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
                path: '/expert',
                name: 'register expert',
                component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth/RegisterExpert.vue'),
            },
            {
                path: '/reset',
                name: 'reset password',
                component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Reset.vue'),
            },
            {
                path: '/verify',
                name: 'verify account',
                component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Verify.vue'),
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
