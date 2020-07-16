<template>
    <div class="container-fluid pt-4 pt-md-8">
        <template v-if="storeId">
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
                <div class="col-xl-3 col-lg-6 mb-4 mb-md-0">
                    <div class="card shadow-sm shadow--hover">
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
                <div class="col-xl-3 col-lg-6">
                    <div class="card shadow-sm shadow--hover">
                        <div class="card-header pb-0">
                            <h3>
                                Store Stats
                                <font-awesome-icon icon="store-alt" class="text-primary" pull="right" />
                            </h3>
                        </div>
                        <div class="card-body bg-secondary">
                            <div class="text-sm row">
                                <div class="col-12">
                                    <span class="mr-2 font-weight-bold">Total Items:</span>
                                    <span>{{ items }}</span>
                                </div>
                                <div class="col-12">
                                    <span class="mr-2 font-weight-bold">Total Categories:</span>
                                    <span>{{ categories }}</span>
                                </div>
                                <div class="col-12">
                                    <span class="mr-2 font-weight-bold">Total Banners:</span>
                                    <span>{{ banners }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-12">
                    <div class="card shadow">
                        <div class="card-header pb-0">
                            <h3>Most Sold Products</h3>
                        </div>
                        <div v-if="mostSoldItems && mostSoldItems.length" class="card-body px-0 pt-0">
                            <div class="table-responsive">
                                <base-table
                                    :data="mostSoldItems"
                                    type="hover table-striped table-sm"
                                    thead-classes="thead-dark"
                                >
                                    <template slot="columns">
                                        <th>#</th>
                                        <th>Item</th>
                                        <th class="text-center">Total Orders</th>
                                    </template>
                                    <template slot-scope="{ row, index }">
                                        <td class="text-left">{{ index + 1 }}</td>
                                        <td>
                                            {{ row.item && row.item.itemDetails && row.item.itemDetails.itemName }}
                                        </td>
                                        <td class="text-center">
                                            {{ row.occurance && parseInt(row.occurance) }}
                                        </td>
                                    </template>
                                </base-table>
                            </div>
                        </div>
                        <div v-else class="card-body">
                            <div class="container">
                                <div class="row">
                                    <div class="col-12 px-0">
                                        <div class="mb-3">
                                            <span class="text-muted">
                                                No data...
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div v-else>
            <div class="container-fluid">
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
        items: null,
        categories: null,
        banners: null,
        mostSoldItems: [],
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
            this.getStoreStats(this.storeId);
        },
    },
    mounted() {
        this.getStats(this.storeId);
        this.getStoreStats(this.storeId);
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
        async getStoreStats(storeId) {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/stores/stats',
                    params: {
                        storeId: storeId,
                    },
                });

                const stats = response.data.store;
                this.items = stats.items;
                this.categories = stats.categories;
                this.banners = stats.banners;
                this.mostSoldItems = stats.mostSoldItems;
            } catch (err) {
                this.$error('Unable to get stats.');
            }
        },
    },
};
</script>
