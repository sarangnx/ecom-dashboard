<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between">
            <h3>Experts</h3>
        </div>
        <div class="card-body p-0 position-relative min__height">
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
                <div>
                    <base-input
                        v-model="search"
                        class="input-group-alternative mb-0"
                        placeholder="search..."
                        addon-right-class="py-0"
                        classes="shadow-lg"
                        @keypress.enter="getExperts"
                    >
                        <template slot="addonRight" class="p-0">
                            <base-button size="sm" icon="search" @click="getExperts" />
                        </template>
                    </base-input>
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
                            <a class="pointer" @click.prevent="order === 'asc' ? (order = 'desc') : (order = 'asc')">
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
                                        selectedExpert = Object.assign({}, row);
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
                            </div>
                        </td>
                    </template>
                    <div slot="caption" class="col-12 p-5 d-flex justify-content-center align-items-center">
                        <div>
                            <span class="text-sm p-2">no experts</span>
                            <font-awesome-icon icon="user-tie" />
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
        <!-- VIEW EXPERT -->
        <modal
            :show.sync="viewModal"
            header-classes="pb-0"
            body-classes="pt-0"
            :click-out="false"
            scrollable
            @close="selectedExpert = null"
        >
            <h4 slot="header" class="modal-title">
                {{ selectedExpert && selectedExpert.profile && selectedExpert.profile.firstName }}
                {{ selectedExpert && selectedExpert.profile && selectedExpert.profile.lastName }}
            </h4>
            <view-expert
                :key="Date.now()"
                :expert="selectedExpert"
                @approved="updateService"
                @verified="updateExpert"
            />
        </modal>
    </div>
</template>
<script>
import ViewExpert from './components/ViewExpert';

export default {
    components: {
        ViewExpert,
    },
    data: () => ({
        experts: null,
        page: 1,
        totalPages: 0,
        perPage: 10,
        order: 'asc',
        loading: false,
        blocked: [],
        selectedExpert: null,
        viewModal: null,
        search: null,
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
            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/services/experts',
                    params: {
                        page: this.page,
                        perPage: this.perPage,
                        order: this.order,
                        search: this.search,
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

            this.loading = false;
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
        updateService(data) {
            const index = this.experts.findIndex((expert) => expert.expertId === this.selectedExpert.expertId);

            const serviceIndex = this.experts[index].services.findIndex(
                (service) => service.serviceId === data.serviceId
            );
            this.$set(this.experts[index].services[serviceIndex].serviceExperts, 'approved', data.approved);
            this.selectedExpert = Object.assign({}, this.experts[index]);
        },
        updateExpert(data) {
            const index = this.experts.findIndex((expert) => expert.expertId === data.expertId);

            this.$set(this.experts[index], 'verified', data.verified);
            this.selectedExpert = Object.assign({}, this.experts[index]);
        },
    },
};
</script>
