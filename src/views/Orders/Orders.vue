<template>
    <div>
        <div v-if="storeId" class="container-fluid pt-4 pt-md-7">
            <div v-if="current" class="mb-3 d-flex">
                <h3 class="mr-2">Store:</h3>
                <base-dropdown>
                    <base-button slot="title" type="default" size="sm" class="dropdown-toggle">
                        {{ current.name }}
                    </base-button>
                    <a v-for="(item, index) in stores" :key="index" class="dropdown-item" @click="change(item)">
                        {{ item.name }}
                    </a>
                </base-dropdown>
            </div>
            <!-- Card stats -->
            <div class="row">
                <div class="col-sm-6 col-md-3">
                    <stats-card
                        title="Total Orders"
                        type="gradient-red"
                        :sub-title="`${totalOrders}`"
                        class="h-100 mb-4 mb-xl-0 shadow-sm shadow--hover"
                    >
                    </stats-card>
                </div>
                <div class="col-sm-6 col-md-3">
                    <stats-card
                        title="Today's Orders"
                        type="gradient-orange"
                        :sub-title="`${totalToday}`"
                        class="h-100 mb-4 mb-xl-0 shadow-sm shadow--hover"
                    >
                    </stats-card>
                </div>
                <div class="col-sm-6 col-md-3">
                    <stats-card
                        title="Items Pending"
                        type="gradient-green"
                        :sub-title="`${orderStatus.pending}`"
                        class="h-100 mb-4 mb-xl-0 shadow-sm shadow--hover"
                    >
                    </stats-card>
                </div>
                <div class="col-sm-6 col-md-3">
                    <stats-card
                        title="Out for Delivery"
                        type="gradient-info"
                        :sub-title="`${orderStatus.outfordelivery}`"
                        class="h-100 mb-4 mb-xl-0 shadow-sm shadow--hover"
                    >
                    </stats-card>
                </div>
            </div>
            <!-- Tables -->
            <div class="row mt-4">
                <div class="col">
                    <orders-table :store-id="storeId"></orders-table>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="container-fluid pt-4 pt-md-7">
                <div class="card shadow p-2 p-md-5">
                    <div class="card-body">
                        <div class="container">
                            <div class="row">
                                <div class="col-12">
                                    <h3>You cannot view this page since you don't have any stores currently.</h3>
                                    <div class="mb-3">
                                        <span class="text-muted">You can return to this page after adding one.</span>
                                    </div>
                                    <base-button icon="external-link-alt" @click="$router.push('/settings/stores')">
                                        Go to settings
                                    </base-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import io from 'socket.io-client';
import OrdersTable from './OrdersTable';

export default {
    name: 'Orders',
    components: {
        OrdersTable,
    },
    data: () => ({
        orderStatus: {
            pending: 0,
            processing: 0,
            ready: 0,
            outfordelivery: 0,
            delivered: 0,
            cancelled: 0,
        },
        totalOrders: 0,
        totalToday: 0,
    }),
    computed: {
        ...mapGetters({
            user: 'auth/getUser',
            stores: 'stores/stores',
            current: 'stores/current',
        }),
        userId() {
            return this.user.userId;
        },
        storeId() {
            if (this.current) {
                return this.current.storeId;
            }
            return null;
        },
    },
    watch: {
        storeId() {
            this.getStats(this.storeId);
        },
    },
    mounted() {
        this.getStats(this.storeId);
    },
    methods: {
        ...mapActions({
            change: 'stores/change',
        }),
        async getStats(storeId) {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/orders/stats',
                    params: {
                        storeId: storeId,
                    },
                });

                const stats = response.data.stats;
                this.orderStatus = Object.assign({}, stats.orderStatus);
                this.totalOrders = stats.totalOrders;
                this.totalToday = stats.totalToday;
            } catch (err) {
                this.$error('Unable to get stats.');
            }
        },
    },
};
</script>
