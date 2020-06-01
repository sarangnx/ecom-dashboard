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
    shopowner: [
        { action: 'menu', subject: 'store-dashboard' },
        { action: 'menu', subject: 'orders' },
        { action: 'menu', subject: 'items' },
        { action: 'menu', subject: 'category' }, // parent
        { action: 'menu', subject: 'store-category' }, // child
    ],
    admin: [
        { action: 'menu', subject: 'admin-dashboard' },
        { action: 'menu', subject: 'category' },
        { action: 'menu', subject: 'store-category' },
    ],
    superadmin: [
        { action: 'menu', subject: 'admin-dashboard' },
        { action: 'menu', subject: 'category' },
        { action: 'menu', subject: 'store-category' },
    ],
};
