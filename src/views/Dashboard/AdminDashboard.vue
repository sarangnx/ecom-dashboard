<template>
    <div class="container-fluid pt-4 pt-md-8">
        <div class="d-flex flex-wrap">
            <div class="col-12 col-md-4 mb-3 mb-md-0">
                <div class="card shadow-sm shadow--hover">
                    <div class="card-header pb-0">
                        <h3>
                            User Stats
                            <font-awesome-icon icon="users" class="text-primary" pull="right" />
                        </h3>
                    </div>
                    <div class="card-body bg-secondary">
                        <div class="text-sm row">
                            <div v-for="(group, key) in userStatsText" :key="key" class="col-12">
                                <span class="mr-2 font-weight-bold">{{ group }}:</span>
                                <span>{{ userStats[key] || 0 }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-4 mb-3 mb-md-0">
                <div class="card shadow-sm shadow--hover">
                    <div class="card-body">
                        <h3>
                            Total Stores
                            <font-awesome-icon icon="store" class="text-primary" pull="right" />
                        </h3>
                        <span class="font-weight-bold">{{ storeStats.stores }}</span>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-4">
                <div class="card shadow-sm shadow--hover">
                    <div class="card-header pb-0">
                        <h3>
                            Inventory Stats
                            <font-awesome-icon icon="drumstick-bite" class="text-primary" pull="right" />
                        </h3>
                    </div>
                    <div class="card-body bg-secondary">
                        <div class="text-sm row">
                            <div class="col-12">
                                <span class="mr-2 font-weight-bold">Total Items:</span>
                                <span>{{ inventoryStats.items }}</span>
                            </div>
                            <div class="col-12">
                                <span class="mr-2 font-weight-bold">Total Categories:</span>
                                <span>{{ inventoryStats.categories }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data: () => ({
        userStats: {},
        userStatsText: {
            total: 'Total Users',
            admin: 'Admins',
            user: 'Customers',
            storeowner: 'Store Owners',
            staff: 'Staffs',
            delivery: 'Devlivery Boys',
            service: 'Service Experts',
        },
        storeStats: {},
        inventoryStats: {},
    }),
    mounted() {
        this.getUserStats();
        this.getStoreStats();
        this.getInventoryStats();
    },
    methods: {
        async getUserStats() {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/users/stats',
                });

                const stats = response.data.stats;
                this.userStats = stats;
            } catch (err) {
                this.$error('Unable to get stats.');
            }
        },
        async getStoreStats() {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/stores/stats/admin',
                });

                const stats = response.data.stats;
                this.storeStats = stats;
            } catch (err) {
                this.$error('Unable to get stats.');
            }
        },
        async getInventoryStats() {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/inventory/stats',
                });

                const stats = response.data.stats;
                this.inventoryStats = stats;
            } catch (err) {
                this.$error('Unable to get stats.');
            }
        },
    },
};
</script>
<style lang="scss" scoped>
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';
.card-columns {
    column-count: 1;
    @include media-breakpoint-up(md) {
        column-count: 2;
    }
    @include media-breakpoint-up(lg) {
        column-count: 3;
    }
}
</style>
