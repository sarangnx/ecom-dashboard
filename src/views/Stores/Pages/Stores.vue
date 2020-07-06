<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between">
            <h3>Stores</h3>
        </div>
        <div class="card-body p-0 position-relative min__height">
            <template v-if="stores && stores.length">
                <div class="p-2 d-flex justify-content-between">
                    <div>
                        <small class="mr-1 font-weight-bold">Per Page:</small>
                        <base-dropdown>
                            <base-button slot="title" size="sm" icon="caret-down" icon-position="right">
                                {{ perPage }}
                            </base-button>
                            <a class="dropdown-item" @click="perPage = 10">10</a>
                            <a class="dropdown-item" @click="perPage = 50">50</a>
                            <a class="dropdown-item" @click="perPage = 100">100</a>
                        </base-dropdown>
                    </div>
                </div>
                <div class="table-responsive">
                    <base-table
                        class="table align-items-center table-flush service-table"
                        thead-classes="thead-dark"
                        :data="stores"
                    >
                        <template slot="columns">
                            <th class="text-center text-white">
                                <a
                                    class="pointer"
                                    @click.prevent="order === 'asc' ? (order = 'desc') : (order = 'asc')"
                                >
                                    Store Name
                                    <font-awesome-icon :icon="order === 'asc' ? 'caret-up' : 'caret-down'" />
                                </a>
                            </th>
                            <th class="text-center text-white">Blocked</th>
                            <th class="text-center text-white">Verified</th>
                            <th class="text-center text-white">Actions</th>
                        </template>
                        <template slot-scope="{ row }">
                            <td class="text-center">
                                <span>
                                    {{ row.name }}
                                </span>
                            </td>
                            <td class="text-center">
                                <badge :type="row.blocked ? 'danger' : 'success'">
                                    {{ row.blocked ? 'Blocked' : 'Active' }}
                                </badge>
                            </td>
                            <td class="text-center">
                                <badge :type="row.verified ? 'success' : 'danger'">
                                    {{ row.verified ? 'Verified' : 'Not Verified' }}
                                </badge>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">
                                    <base-button type="primary" icon="eye" size="sm" title="View Details"></base-button>
                                    <base-button
                                        :type="row.blocked ? 'success' : 'warning'"
                                        :icon="row.blocked ? 'user' : 'user-slash'"
                                        size="sm"
                                        :title="row.blocked ? 'Unblock Store' : 'Block Store'"
                                        :loading="blocked && blocked.includes(row.storeId)"
                                        :disabled="blocked && blocked.includes(row.storeId)"
                                        @click="blockStore(row.storeId, !row.blocked)"
                                    ></base-button>
                                </div>
                            </td>
                        </template>
                    </base-table>
                </div>
            </template>
            <div
                v-if="!(stores && stores.length) && !loading"
                class="col-12 p-5 d-flex justify-content-center flex-column align-items-center"
            >
                <div>
                    <small class="p-2">no stores</small>
                    <font-awesome-icon icon="store" />
                </div>
            </div>
            <div v-if="loading" class="over__lay">
                <loading color="dark" />
            </div>
        </div>
        <div v-if="totalPages" class="card-footer">
            <base-pagination v-model="page" :page-count="totalPages" align="center" />
        </div>
    </div>
</template>
<script>
export default {
    data: () => ({
        loading: null,
        page: 1,
        perPage: 10,
        stores: null,
        totalPages: null,
        order: 'asc',
        blocked: [],
    }),
    watch: {
        page() {
            this.getStores();
        },
        perPage() {
            this.getStores();
        },
        order() {
            this.getStores();
        },
    },
    mounted() {
        this.getStores();
    },
    methods: {
        async getStores() {
            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/stores/admin',
                    params: {
                        page: this.page,
                        perPage: this.perPage,
                        order: this.order,
                    },
                });

                const stores = response.data.stores;
                this.stores = stores.rows;
                this.totalPages = Math.ceil(stores.count / this.perPage);
            } catch (err) {
                const res = err.response;
                if (res && res.status >= 400 && res.status < 500 && res.data.error) {
                    this.$error(res.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }

            this.loading = false;
        },
        async blockStore(storeId, blocked) {
            this.blocked.push(storeId);

            try {
                const response = await this.$axios({
                    method: 'patch',
                    url: '/stores/store/block',
                    data: {
                        storeId,
                        blocked,
                    },
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                }

                // reflect the changes in table
                const index = this.stores.findIndex((store) => store.storeId === storeId);
                this.stores[index].blocked = blocked;
            } catch (err) {
                const res = err.response;
                if (res && res.status >= 400 && res.status < 500 && res.data.error) {
                    this.$error(res.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }

            // remove item from block array
            const index = this.blocked.indexOf(storeId);
            if (index > -1) this.blocked.splice(index, 1);
        },
    },
};
</script>
