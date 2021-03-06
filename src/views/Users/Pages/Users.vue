<template>
    <div class="card shadow-lg">
        <div class="card-header">
            <h3 class="m-0">Users</h3>
        </div>
        <div class="card-body bg-secondary p-0 position-relative min__height">
            <div class="p-2 d-flex justify-content-between align-items-center">
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
                <div>
                    <base-input
                        v-model="search"
                        class="input-group-alternative mb-0"
                        placeholder="search..."
                        addon-right-class="py-0"
                        classes="shadow-lg"
                        @keypress.enter="listUsers"
                    >
                        <template slot="addonRight" class="p-0">
                            <base-button size="sm" icon="search" @click="listUsers" />
                        </template>
                    </base-input>
                </div>
            </div>
            <div class="table-responsive" style="min-height: 400px;">
                <base-table
                    class="table align-items-center table-flush service-table"
                    thead-classes="thead-dark"
                    :data="users"
                >
                    <template slot="columns">
                        <th class="text-center text-white" title="Sort By Name">
                            <a class="pointer" @click.prevent="order === 'asc' ? (order = 'desc') : (order = 'asc')">
                                Name
                                <font-awesome-icon :icon="order === 'asc' ? 'caret-up' : 'caret-down'" />
                            </a>
                        </th>
                        <th class="text-center text-white">Blocked</th>
                        <th class="text-center text-white">Verified</th>
                        <th class="text-center text-white" title="Filter By Usergroup">
                            <base-dropdown position="right">
                                <a slot="title" type="primary" size="sm" class="dropdown-toggle">
                                    {{ selectedGroup ? usergroupText[selectedGroup] : 'User Group' }}
                                </a>
                                <a class="dropdown-item text-capitalize pointer" @click="selectedGroup = null">
                                    All
                                </a>
                                <a
                                    v-for="(value, key) in usergroupText"
                                    :key="key"
                                    class="dropdown-item text-capitalize pointer"
                                    @click="selectedGroup = key"
                                >
                                    {{ value }}
                                </a>
                            </base-dropdown>
                        </th>
                        <th class="text-center text-white">Actions</th>
                    </template>
                    <template slot-scope="{ row }">
                        <td class="text-center">
                            <span>{{ row.firstName }} {{ row.lastName }}</span>
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
                        <td class="text-center">
                            {{ usergroupText[row.usergroup] }}
                        </td>
                        <td>
                            <div class="d-flex justify-content-center">
                                <base-button
                                    type="primary"
                                    icon="eye"
                                    size="sm"
                                    title="View Details"
                                    @click="$router.push(`/users/${row.userId}`)"
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
                    <div slot="caption" class="col-12 p-5 d-flex justify-content-center align-items-center">
                        <div>
                            <span class="text-sm p-2">no users</span>
                            <font-awesome-icon icon="users" />
                        </div>
                    </div>
                </base-table>
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
        usergroupText: {
            superadmin: 'Super Admin',
            admin: 'Admin',
            user: 'Customer',
            storeowner: 'Store Owner',
            staff: 'Staff',
            delivery: 'Devlivery Boy',
            service: 'Service Expert',
        },
        selectedGroup: null,
        search: null,
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
        selectedGroup() {
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
                        usergroup: this.selectedGroup,
                        search: this.search,
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
        async blockUser(userId, blocked) {
            this.blocked.push(userId);

            try {
                const response = await this.$axios({
                    method: 'patch',
                    url: '/users/block',
                    data: {
                        userId,
                        blocked,
                    },
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                }

                // reflect the changes in table
                const index = this.users.findIndex((user) => user.userId === userId);
                this.users[index].blocked = blocked;
            } catch (err) {
                const res = err.response;
                if (res && res.status >= 400 && res.status < 500 && res.data.error) {
                    this.$error(res.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }

            // remove item from block array
            const index = this.blocked.indexOf(userId);
            if (index > -1) this.blocked.splice(index, 1);
        },
    },
};
</script>
