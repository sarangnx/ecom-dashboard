<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between">
            <h3>Experts</h3>
        </div>
        <div class="card-body p-0 position-relative min__height">
            <template v-if="experts && experts.length">
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
                        :data="experts"
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
                                <span>
                                    {{ row.profile && row.profile.firstName }}
                                    {{ row.profile && row.profile.lastName }}
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
                                    <base-button
                                        type="primary"
                                        icon="eye"
                                        size="sm"
                                        title="View Details"
                                        @click="
                                            viewModal = true;
                                            selectedService = row;
                                        "
                                    ></base-button>
                                    <base-button
                                        :type="row.blocked ? 'success' : 'warning'"
                                        :icon="row.blocked ? 'user' : 'user-slash'"
                                        size="sm"
                                        :title="row.blocked ? 'Unblock User' : 'Block User'"
                                        :loading="blocked && blocked.includes(row.expertId)"
                                        :disabled="blocked && blocked.includes(row.expertId)"
                                        @click="blockExpert(row.expertId, !row.blocked)"
                                    ></base-button>
                                    <base-button
                                        type="danger"
                                        icon="trash"
                                        size="sm"
                                        @click="
                                            deleteModal = true;
                                            selectedService = row;
                                        "
                                    ></base-button>
                                </div>
                            </td>
                        </template>
                    </base-table>
                </div>
            </template>
            <div
                v-if="!(experts && experts.length) && !loading"
                class="col-12 p-5 d-flex justify-content-center flex-column align-items-center"
            >
                <div>
                    <small class="p-2">no experts</small>
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
        experts: null,
        page: 1,
        totalPages: 0,
        perPage: 10,
        order: 'asc',
        loading: false,
        blocked: [],
    }),
    watch: {
        page() {
            this.getExperts();
        },
        perPage() {
            this.getExperts();
        },
        order() {
            this.getExperts();
        },
    },
    mounted() {
        this.getExperts();
    },
    methods: {
        async getExperts() {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/services/experts',
                    params: {
                        page: this.page,
                        perPage: this.perPage,
                        order: this.order,
                    },
                });

                const experts = response.data.experts;
                this.experts = experts.rows;
                this.totalPages = Math.ceil(experts.count / this.perPage);
            } catch (err) {
                const res = err.response;
                if (res && res.status >= 400 && res.status < 500 && res.data.error) {
                    this.$error(res.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }
        },
        async blockExpert(expertId, blocked) {
            this.blocked.push(expertId);

            try {
                const response = await this.$axios({
                    method: 'patch',
                    url: '/services/experts/block',
                    data: {
                        expertId,
                        blocked,
                    },
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                }

                // reflect the changes in table
                const index = this.experts.findIndex((expert) => expert.expertId === expertId);
                this.experts[index].blocked = blocked;
            } catch (err) {
                const res = err.response;
                if (res && res.status >= 400 && res.status < 500 && res.data.error) {
                    this.$error(res.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }

            // remove item from block array
            const index = this.blocked.indexOf(expertId);
            if (index > -1) this.blocked.splice(index, 1);
        },
    },
};
</script>
