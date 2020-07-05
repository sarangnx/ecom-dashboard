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
    service: [{ action: ['menu', 'route'], subject: ['service-dashboard', 'manage-pincodes'] }],
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
        { action: 'route', subject: ['settings-stores', 'settings-profile', 'settings-password'] },
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
        { action: 'route', subject: ['settings-profile', 'settings-password'] },
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
        { action: 'route', subject: ['settings-profile', 'settings-password'] },
        { action: 'settings', subject: ['profile', 'password'] },
    ],
};
