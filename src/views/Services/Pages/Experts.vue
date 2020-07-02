<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between">
            <h3>Experts</h3>
        </div>
        <div class="card-body p-0 position-relative min__height">
            <template v-if="experts && experts.length">
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
                                        type="success"
                                        icon="eye"
                                        size="sm"
                                        @click="
                                            viewModal = true;
                                            selectedService = row;
                                        "
                                    ></base-button>
                                    <base-button
                                        type="primary"
                                        icon="edit"
                                        size="sm"
                                        @click="
                                            editModal = true;
                                            selectedService = row;
                                        "
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
    </div>
</template>
<script>
export default {
    data: () => ({
        experts: null,
        totalPages: 0,
        perPage: 10,
        order: 'asc',
        loading: false,
    }),
    mounted() {
        this.getExperts();
    },
    methods: {
        async getExperts() {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/services/experts',
                });

                const experts = response.data.experts;
                this.experts = experts.rows;
                this.totalPages = Math.ceil(experts.count / this.perPage);
                console.log(this.experts);
            } catch (err) {
                const res = err.response;
                if (res && res.status >= 400 && res.status < 500 && res.data.error) {
                    this.$error(res.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }
        },
    },
};
</script>
