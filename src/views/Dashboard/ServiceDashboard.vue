<template>
    <div class="container-fluid pt-4 pt-md-8">
        <div class="row">
            <div class="col-12">
                <div class="card shadow-lg">
                    <div class="card-header d-flex justify-content-start align-items-center">
                        <h3 class="m-0">Dashboard</h3>
                    </div>
                    <div class="card-body bg-secondary">
                        <div v-if="expert && expert.blocked" class="row">
                            <div class="col-12">
                                <div class="alert alert-danger">
                                    <font-awesome-icon icon="user-slash" class="mr-3" />
                                    Your Account has been <span class="font-weight-bold">Blocked.</span>
                                    For further details contact Support.
                                </div>
                            </div>
                        </div>
                        <div class="card shadow-lg mb-3">
                            <div v-if="expert" class="row card-body">
                                <div class="col-12 mb-2">
                                    <small class="font-weight-bold mr-2">Name:</small>
                                    <span v-if="expert.profile">
                                        {{ expert.profile.firstName }}
                                        {{ expert.profile.lastName }}
                                    </span>
                                </div>
                                <div class="col-12 mb-2">
                                    <small class="font-weight-bold mr-2">Contact Number:</small>
                                    <span>{{ expert.contactNumber }}</span>
                                </div>
                                <div class="col-12 mb-2">
                                    <small class="font-weight-bold mr-2">WhatsApp Number:</small>
                                    <span>{{ expert.whatsappNumber }}</span>
                                </div>
                                <div class="col-12 mb-2">
                                    <small class="font-weight-bold mr-2">Verification Status:</small>
                                    <badge :type="expert.verified ? 'success' : 'danger'">
                                        {{ expert.verified ? 'Verified' : 'Not Verified' }}
                                    </badge>
                                </div>
                            </div>
                        </div>
                        <div v-if="expert" class="card shadow-lg">
                            <div class="card-header border-0 pb-0">
                                <h3>Services</h3>
                            </div>
                            <div class="card-body p-0">
                                <div class="mb-2 table-responsive">
                                    <base-table
                                        class="table align-items-center"
                                        thead-classes="thead-dark"
                                        :data="expert.services"
                                    >
                                        <template slot="columns">
                                            <th class="text-center text-white">
                                                Service Name
                                            </th>
                                            <th class="text-center text-white">Status</th>
                                        </template>
                                        <template slot-scope="{ row }">
                                            <td class="text-center">
                                                {{ row.name }}
                                            </td>
                                            <td class="text-center">
                                                <badge :type="row.serviceExperts.approved ? 'success' : 'danger'">
                                                    {{ row.serviceExperts.approved ? 'Active' : 'Blocked' }}
                                                </badge>
                                            </td>
                                        </template>
                                    </base-table>
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
import { mapGetters } from 'vuex';

export default {
    data: () => ({
        expert: null,
    }),
    computed: {
        ...mapGetters({
            user: 'auth/getUser',
        }),
        userId() {
            return this.user ? this.user.userId : null;
        },
    },
    mounted() {
        this.getProfile();
    },
    methods: {
        async getProfile() {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/services/expert',
                    params: {
                        userId: this.userId,
                    },
                });

                this.expert = response.data.expert;
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
