<template>
    <div class="card shadow-lg">
        <div class="card-header">
            <h3 class="m-0">Users</h3>
        </div>
        <div class="card-body bg-secondary p-0 position-relative min__height">
            <template v-if="users && users.length">
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
                        :data="users"
                    >
                        <template slot="columns">
                            <th class="text-center text-white">
                                <a
                                    class="pointer"
                                    @click.prevent="order === 'asc' ? (order = 'desc') : (order = 'asc')"
                                >
                                    Name
                                    <font-awesome-icon :icon="order === 'asc' ? 'caret-up' : 'caret-down'" />
                                </a>
                            </th>
                            <th class="text-center text-white">Blocked</th>
                            <th class="text-center text-white">Verified</th>
                            <th class="text-center text-white">Actions</th>
                        </template>
                        <template slot-scope="{ row }">
                            <td class="text-center">
                                <span>{{ row.firstName }}{{ row.lastName }}</span>
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
                                    <base-button
                                        type="primary"
                                        icon="eye"
                                        size="sm"
                                        title="View Details"
                                        @click="
                                            viewModal = true;
                                            selectedUser = Object.assign({}, row);
                                        "
                                    ></base-button>
                                    <base-button
                                        :type="row.blocked ? 'success' : 'warning'"
                                        :icon="row.blocked ? 'user' : 'user-slash'"
                                        size="sm"
                                        :title="row.blocked ? 'Unblock User' : 'Block User'"
                                        :loading="blocked && blocked.includes(row.userId)"
                                        :disabled="blocked && blocked.includes(row.userId)"
                                        @click="blockUser(row.userId, !row.blocked)"
                                    ></base-button>
                                </div>
                            </td>
                        </template>
                    </base-table>
                </div>
            </template>
            <div
                v-if="!(users && users.length) && !loading"
                class="col-12 p-5 d-flex justify-content-center flex-column align-items-center"
            >
                <div>
                    <small class="p-2">no users</small>
                    <font-awesome-icon icon="inbox" />
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
        users: null,
        page: 1,
        perPage: 10,
        totalPages: null,
        order: 'asc',
        blocked: [],
        selectedUser: null,
        viewModal: null,
    }),
    watch: {
        page() {
            this.listUsers();
        },
        perPage() {
            this.listUsers();
        },
        order() {
            this.listUsers();
        },
    },
    mounted() {
        this.listUsers();
    },
    methods: {
        async listUsers() {
            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/users/list',
                    params: {
                        page: this.page,
                        perPage: this.perPage,
                        order: this.order,
                    },
                });

                const users = response.data.users;
                this.users = users.rows;
                this.totalPages = Math.ceil(users.count / this.perPage);
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
    },
};
</script>
