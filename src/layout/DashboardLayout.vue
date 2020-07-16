<template>
    <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
        <side-bar :bg-color="sidebarBackground">
            <template slot="links">
                <template v-for="(item, index) in activeSidebarItems">
                    <sidebar-item v-if="item.type === 'sidebaritem'" :key="index" :link="item" />
                    <sidebar-dropdown
                        v-if="item.type === 'sidebardropdown'"
                        :key="index"
                        :title="item.name"
                        :icon="item.icon"
                        :classes="item.class"
                        :children="item.children"
                    />
                </template>
            </template>
        </side-bar>
        <div class="main-content" :data="sidebarBackground">
            <dashboard-navbar></dashboard-navbar>

            <div style="min-height: 100%;" class="d-flex flex-column" @click="toggleSidebar">
                <fade-transition :duration="200" origin="center top" mode="out-in">
                    <!-- your content here -->
                    <router-view class="flex-grow-1"></router-view>
                </fade-transition>
                <content-footer v-if="!$route.meta.hideFooter"></content-footer>
            </div>
        </div>
    </div>
</template>
<script>
import DashboardNavbar from './DashboardNavbar.vue';
import ContentFooter from './ContentFooter.vue';
import { FadeTransition } from 'vue2-transitions';

export default {
    components: {
        DashboardNavbar,
        ContentFooter,
        FadeTransition,
    },
    data: () => ({
        sidebarBackground: 'white', //vue|blue|orange|green|red|primary
        sidebarItems: [
            {
                name: 'Dashboard', // Display in sidenav
                subject: 'store-dashboard', // casl ability subject
                icon: 'desktop',
                class: 'text-blue',
                path: '/dashboard',
                type: 'sidebaritem',
            },
            {
                name: 'Dashboard',
                subject: 'admin-dashboard',
                icon: 'desktop',
                class: 'text-blue',
                path: '/admin',
                type: 'sidebaritem',
            },
            {
                name: 'Dashboard',
                subject: 'service-dashboard',
                icon: 'desktop',
                class: 'text-blue',
                path: '/service-dashboard',
                type: 'sidebaritem',
            },
            {
                name: 'Orders',
                subject: 'orders',
                icon: 'shopping-basket',
                class: 'text-blue',
                path: '/orders',
                type: 'sidebaritem',
            },
            {
                name: 'Quick Orders',
                subject: 'quick-orders',
                icon: 'shopping-basket',
                class: 'text-blue',
                path: '/quick-orders',
                type: 'sidebaritem',
            },
            {
                name: 'Category',
                subject: 'category',
                icon: 'th',
                class: 'text-blue',
                type: 'sidebardropdown',
                children: [
                    { name: 'Master Category', path: '/category/master', subject: 'master-category' },
                    { name: 'Store Category', path: '/category/store', subject: 'store-category' },
                ],
            },
            {
                name: 'Items',
                subject: 'items',
                icon: 'book',
                class: 'text-blue',
                type: 'sidebardropdown',
                children: [
                    { name: 'Master Items', path: '/items/master', subject: 'master-items' },
                    { name: 'Add Items from Excel', path: '/items/excel', subject: 'excel' },
                    { name: 'Add Item', path: '/items/add-items', subject: 'store-items' },
                    { name: 'Store Item', path: '/items/store', subject: 'store-items' },
                ],
            },
            {
                name: 'Banners',
                subject: 'banners',
                icon: 'ad',
                class: 'text-blue',
                path: '/banners',
                type: 'sidebaritem',
            },
            {
                name: 'Notifications',
                subject: 'notifications',
                icon: 'bell',
                class: 'text-blue',
                path: '/notifications',
                type: 'sidebaritem',
            },
            {
                name: 'Services',
                subject: 'services',
                icon: 'user-tie',
                class: 'text-blue',
                type: 'sidebardropdown',
                children: [
                    { name: 'Manage Services', path: '/services/manage-services', subject: 'manage-services' },
                    { name: 'Manage Experts', path: '/services/manage-experts', subject: 'manage-experts' },
                ],
            },
            {
                name: 'Stores',
                subject: 'stores',
                icon: 'store',
                class: 'text-blue',
                path: '/stores',
                type: 'sidebaritem',
            },
            {
                name: 'Serviceable Locations',
                subject: 'manage-pincodes',
                icon: 'user-tie',
                class: 'text-blue',
                path: '/manage-pincodes',
                type: 'sidebaritem',
            },
            {
                name: 'Users',
                subject: 'users',
                icon: 'users',
                class: 'text-blue',
                path: '/users',
                type: 'sidebaritem',
            },
            {
                name: 'Settings',
                subject: 'settings',
                icon: 'cog',
                class: 'text-blue',
                path: '/settings',
                type: 'sidebaritem',
            },
        ],
    }),
    computed: {
        activeSidebarItems() {
            // filter out sidebar items that the usergroup has access to.
            let sidebarItems = this.sidebarItems.filter((item) => {
                if (item.children) {
                    item.children = item.children.filter((child) => {
                        return this.$can('menu', child.subject);
                    });
                }
                return this.$can('menu', item.subject);
            });

            // if a sidebarItem has only 1 child, convert it to item rather than dropdown.
            for (let index in sidebarItems) {
                if (sidebarItems[index].children && sidebarItems[index].children.length === 1) {
                    sidebarItems[index].path = sidebarItems[index].children[0].path;
                    sidebarItems[index].type = 'sidebaritem';
                    delete sidebarItems[index].children;
                }
            }

            return sidebarItems;
        },
    },
    methods: {
        toggleSidebar() {
            if (this.$sidebar.showSidebar) {
                this.$sidebar.displaySidebar(false);
            }
        },
    },
};
</script>
