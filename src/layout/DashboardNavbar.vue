<template>
    <base-nav id="navbar-main" class="navbar-top navbar-dark" :show-toggle-button="false" expand>
        <ul class="navbar-nav align-items-center d-none d-md-flex">
            <li class="nav-item dropdown">
                <base-dropdown class="nav-link pr-0" position="right">
                    <div slot="title" class="media align-items-center">
                        <div class="media-body ml-2 d-none d-lg-block">
                            <base-button icon-only rounded size="lg" type="secondary" icon="cog"></base-button>
                        </div>
                    </div>

                    <template>
                        <router-link to="/settings" class="dropdown-item">
                            <font-awesome-icon icon="cogs"></font-awesome-icon>
                            <span>Settings</span>
                        </router-link>
                        <router-link to="/logout" class="dropdown-item">
                            <font-awesome-icon icon="sign-out-alt"></font-awesome-icon>
                            <span>Logout</span>
                        </router-link>
                    </template>
                </base-dropdown>
            </li>
        </ul>
    </base-nav>
</template>
<script>
export default {
    data() {
        return {
            activeNotifications: false,
            showMenu: false,
            searchQuery: '',
        };
    },
    methods: {
        toggleSidebar() {
            this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
        },
        hideSidebar() {
            this.$sidebar.displaySidebar(false);
        },
        toggleMenu() {
            this.showMenu = !this.showMenu;
        },
    },
};
</script>
