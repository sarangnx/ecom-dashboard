<template>
    <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
        <side-bar :bg-color="sidebarBackground">
            <template slot="links">
                <template v-for="(item, index) in sidebarItems">
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

            <div @click="toggleSidebar">
                <fade-transition :duration="200" origin="center top" mode="out-in">
                    <!-- your content here -->
                    <router-view></router-view>
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
                name: 'Dashboard',
                icon: 'desktop',
                class: 'text-blue',
                path: '/dashboard',
                type: 'sidebaritem',
            },
            {
                name: 'Dashboard',
                icon: 'desktop',
                class: 'text-blue',
                path: '/admin',
                type: 'sidebaritem',
            },
            {
                name: 'Orders',
                icon: 'shopping-basket',
                class: 'text-blue',
                path: '/orders',
                type: 'sidebaritem',
            },
            {
                name: 'Items',
                icon: 'book',
                class: 'text-blue',
                type: 'sidebardropdown',
                children: [
                    { name: 'View Items', path: '/items/view-items' },
                    { name: 'Add Item', path: '/items/add-item' },
                    { name: 'Add Item From Excel', path: '/items/add-excel' },
                ],
            },
            {
                name: 'Notifications',
                icon: 'bell',
                class: 'text-blue',
                path: '/notifications',
                type: 'sidebaritem',
            },
            {
                name: 'Users',
                icon: 'user',
                class: 'text-blue',
                path: '/users',
                type: 'sidebaritem',
            },
        ],
    }),
    methods: {
        toggleSidebar() {
            if (this.$sidebar.showSidebar) {
                this.$sidebar.displaySidebar(false);
            }
        },
    },
};
</script>
