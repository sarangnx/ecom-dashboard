/**
 * Rules
 *  - action 'menu' is for filtering out dashboard navbar items.
 *  - if a navbar item with children are to be allowed, both
 *    parent and child subjects are to be included.
 */
export default {
    guest: [],
    user: [],
    delivery: [],
    staff: [],
    storeowner: [
        {
            action: ['menu', 'route'],
            subject: [
                'store-dashboard',
                'orders',
                'quick-orders',
                'items',
                'banners',
                'store-items',
                'category',
                'store-category',
                'settings',
            ],
        },
        { action: 'settings', subject: ['profile', 'stores', 'password'] },
    ],
    admin: [
        {
            action: ['menu', 'route'],
            subject: [
                'admin-dashboard',
                'category',
                'master-category',
                'banners',
                'items',
                'master-items',
                'excel',
                'services',
                'manage-services',
                'manage-experts',
                'settings',
            ],
        },
        { action: 'settings', subject: ['profile', 'password'] },
    ],
    superadmin: [
        {
            action: ['menu', 'route'],
            subject: [
                'admin-dashboard',
                'category',
                'master-category',
                'banners',
                'items',
                'master-items',
                'excel',
                'services',
                'manage-services',
                'manage-experts',
                'settings',
            ],
        },
        { action: 'settings', subject: ['profile', 'password'] },
    ],
};
