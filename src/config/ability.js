export default {
    guest: [],
    user: [],
    delivery: [],
    staff: [],
    shopowner: [
        {
            action: 'menu',
            subject: 'store-dashboard',
        },
        {
            action: 'menu',
            subject: 'orders',
        },
        {
            action: 'menu',
            subject: 'items',
        },
    ],
    admin: [
        {
            action: 'menu',
            subject: 'admin-dashboard',
        },
    ],
    superadmin: [
        {
            action: 'menu',
            subject: 'admin-dashboard',
        },
    ],
};
