<template>
    <li class="nav-item">
        <router-link
            :to="link.path"
            class="nav-link"
            :target="link.target"
            :href="link.path"
            active-class="active"
            @click.native="linkClick"
        >
            <template>
                <font-awesome-icon :icon="link.icon" class="mr-2" fixed-width :class="link.class" />
                <span class="nav-link-text">{{ link.name }}</span>
            </template>
        </router-link>
    </li>
</template>
<script>
export default {
    name: 'SidebarItem',
    props: {
        link: {
            type: Object,
            default: () => {
                return {
                    name: '',
                    path: '',
                    children: [],
                };
            },
            description: 'Sidebar link. Can contain name, path, icon and other attributes. See examples for more info',
        },
    },
    inject: {
        autoClose: {
            default: true,
        },
    },
    data() {
        return {
            children: [],
            collapsed: true,
        };
    },
    methods: {
        linkClick() {
            if (this.autoClose && this.$sidebar && this.$sidebar.showSidebar === true) {
                this.$sidebar.displaySidebar(false);
            }
        },
    },
};
</script>
