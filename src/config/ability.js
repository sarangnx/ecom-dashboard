import { Ability } from '@casl/ability';

export default {
    guest: new Ability([
        {
            action: 'manage',
            subject: 'all',
            inverted: true,
        },
    ]),
    user: [],
    delivery: [],
    staff: [],
    shopowner: new Ability([
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
    ]),
    admin: new Ability([
        {
            action: 'menu',
            subject: 'admin-dashboard',
        },
    ]),
    superadmin: new Ability([
        {
            action: 'menu',
            subject: 'admin-dashboard',
        },
    ]),
};
