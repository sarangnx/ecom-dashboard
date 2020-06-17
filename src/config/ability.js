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
        { action: 'menu', subject: 'store-dashboard' },
        { action: 'menu', subject: 'orders' },
        { action: 'menu', subject: 'quick-orders' },
        { action: 'menu', subject: 'items' },
        { action: 'menu', subject: 'store-items' },
        { action: 'menu', subject: 'category' }, // parent
        { action: 'menu', subject: 'store-category' }, // child
        { action: 'menu', subject: 'banners' },
        { action: 'menu', subject: 'settings' },
        { action: 'settings', subject: ['profile', 'stores', 'password'] },
    ],
    admin: [
        { action: 'menu', subject: 'admin-dashboard' },
        { action: 'menu', subject: 'category' },
        { action: 'menu', subject: 'master-category' },
        { action: 'menu', subject: 'items' },
        { action: 'menu', subject: 'master-items' },
        { action: 'menu', subject: 'banners' },
        { action: 'menu', subject: 'settings' },
        { action: 'settings', subject: ['profile', 'password'] },
    ],
    superadmin: [
        { action: 'menu', subject: 'admin-dashboard' },
        { action: 'menu', subject: 'category' },
        { action: 'menu', subject: 'master-category' },
        { action: 'menu', subject: 'items' },
        { action: 'menu', subject: 'master-items' },
        { action: 'menu', subject: 'banners' },
        { action: 'menu', subject: 'settings' },
        { action: 'settings', subject: ['profile', 'password'] },
    ],
};
