<template>
    <nav
        id="sidenav-main"
        class="navbar navbar-vertical fixed-left navbar-expand-md navbar-light custom__scrollbar"
        :class="[`bg-${bgColor}`]"
    >
        <div class="container-fluid">
            <!--Toggler-->
            <navbar-toggle-button @click.native="showSidebar">
                <span class="navbar-toggler-icon"></span>
            </navbar-toggle-button>
            <router-link class="navbar-brand" to="/">
                <img :src="logo" class="navbar-brand-img" alt="..." />
            </router-link>

            <slot name="mobile-right">
                <ul class="nav align-items-center d-md-none">
                    <base-dropdown class="nav-item" position="right">
                        <a slot="title" class="nav-link" href="#" role="button">
                            <div>
                                <base-button icon="cog" type="dark" text size="sm" icon-only rounded />
                            </div>
                        </a>
                        <router-link to="/settings" class="dropdown-item">
                            <font-awesome-icon icon="cogs"></font-awesome-icon>
                            <span>Settings</span>
                        </router-link>
                        <router-link to="/logout" class="dropdown-item">
                            <font-awesome-icon icon="sign-out-alt"></font-awesome-icon>
                            <span>Logout</span>
                        </router-link>
                    </base-dropdown>
                </ul>
            </slot>
            <slot></slot>
            <div v-show="$sidebar.showSidebar" id="sidenav-collapse-main" class="navbar-collapse collapse show">
                <div class="navbar-collapse-header d-md-none">
                    <div class="row">
                        <div class="col-6 collapse-brand">
                            <img :src="logo" />
                        </div>
                        <div class="col-6 collapse-close d-flex justify-content-end align-items-center">
                            <navbar-toggle-button @click.native="closeSidebar"></navbar-toggle-button>
                        </div>
                    </div>
                </div>

                <ul class="navbar-nav">
                    <slot name="links"> </slot>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script>
import NavbarToggleButton from '@/components/NavbarToggleButton';

export default {
    name: 'Sidebar',
    components: {
        NavbarToggleButton,
    },
    props: {
        logo: {
            type: String,
            default: '/img/logo-rect.webp',
        },
        autoClose: {
            type: Boolean,
            default: true,
            description: 'Whether sidebar should autoclose on mobile when clicking an item',
        },
        bgColor: {
            type: String,
            default: 'white',
        },
    },
    provide() {
        return {
            autoClose: this.autoClose,
        };
    },
    beforeDestroy() {
        if (this.$sidebar.showSidebar) {
            this.$sidebar.showSidebar = false;
        }
    },
    methods: {
        closeSidebar() {
            this.$sidebar.displaySidebar(false);
        },
        showSidebar() {
            this.$sidebar.displaySidebar(true);
        },
    },
};
</script>
