<template>
    <div>
        <template v-if="storeId">
            <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
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
                <div class="row">
                    <div class="col-xl-3 col-lg-6">
                        <div class="card shadow-lg">
                            <div class="card-header pb-0">
                                <h3>
                                    Order Stats
                                    <font-awesome-icon icon="shopping-basket" class="text-primary" pull="right" />
                                </h3>
                            </div>
                            <div class="card-body bg-secondary">
                                <div class="text-sm row">
                                    <div class="col-12">
                                        <span class="mr-2 font-weight-bold">Total Orders:</span>
                                        <span>{{ totalOrders }}</span>
                                    </div>
                                    <div class="col-12">
                                        <span class="mr-2 font-weight-bold">Total Orders Today:</span>
                                        <span>{{ totalToday }}</span>
                                    </div>
                                    <div class="col-12">
                                        <span class="mr-2 font-weight-bold">Pending:</span>
                                        <span>{{ orderStatus && orderStatus.pending }}</span>
                                    </div>
                                    <div class="col-12">
                                        <span class="mr-2 font-weight-bold">Processing:</span>
                                        <span>{{ orderStatus && orderStatus.processing }}</span>
                                    </div>
                                    <div class="col-12">
                                        <span class="mr-2 font-weight-bold">Ready:</span>
                                        <span>{{ orderStatus && orderStatus.ready }}</span>
                                    </div>
                                    <div class="col-12">
                                        <span class="mr-2 font-weight-bold">Out for Delivery:</span>
                                        <span>{{ orderStatus && orderStatus.outfordelivery }}</span>
                                    </div>
                                    <div class="col-12">
                                        <span class="mr-2 font-weight-bold">Delivered:</span>
                                        <span>{{ orderStatus && orderStatus.delivered }}</span>
                                    </div>
                                    <div class="col-12">
                                        <span class="mr-2 font-weight-bold">Cancelled:</span>
                                        <span>{{ orderStatus && orderStatus.cancelled }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </base-header>
            <div class="container-fluid mt--7">
                <div class="row">
                    <div class="col-12">
                        <div class="card shadow">
                            <div class="card-header d-flex justify-content-between">
                                <h2>Most Sold Products</h2>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <!-- <base-table :data="most_sold" type="hover table-striped table-sm">
                                    <template slot="columns">
                                        <th>#</th>
                                        <th>Item</th>
                                        <th>Total Orders</th>
                                    </template>

                                    <template slot-scope="{ row, index }">
                                        <td class="text-left">
                                            {{ index + 1 }}
                                        </td>
                                        <td>
                                            <img v-if="row.item_details.image_path" class="item-image" />
                                            <i v-else class="fa fa-image"></i> -->
                                    <!-- Alt Image -->
                                    <!-- {{ row.item_details.item_name }}
                                        </td>
                                        <td>
                                            {{ parseInt(row.occurance) }}
                                        </td>
                                    </template>
                                </base-table> -->
                                    <!-- Table -->
                                </div>
                                <!-- responsive-table -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div v-else>
            <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8"> </base-header>
            <div class="container-fluid mt--7">
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

export default {
    data: () => ({
        orderStatus: null,
        totalOrders: null,
        totalToday: null,
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
            return this.current ? this.current.storeId : null;
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
<style scoped>
.item-image {
    max-width: 100%;
    height: 25px;
}
</style>
