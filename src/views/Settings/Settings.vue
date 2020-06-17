<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between">
            <h3>Settings</h3>
        </div>
        <div class="card-body d-flex flex-row justify-content-start flex-wrap">
            <div class="container">
                <div class="row">
                    <div v-for="(link, index) in activeLinks" :key="index" class="col-12">
                        <base-button type="link" :href="link.route" tag="a" @click.prevent="$router.push(link.route)">
                            {{ link.text }}
                        </base-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Settings',
    data: () => ({
        links: [
            {
                text: 'Profile',
                route: '/settings/profile',
                subject: 'profile',
            },
            {
                text: 'Change Password',
                route: '/settings/password',
                subject: 'password',
            },
            {
                text: 'Stores',
                route: '/settings/stores',
                subject: 'stores',
            },
        ],
    }),
    computed: {
        activeLinks() {
            // filter out links that the usergroup has access to.
            return this.links.filter((link) => {
                return this.$can('settings', link.subject);
            });
        },
    },
};
</script>
