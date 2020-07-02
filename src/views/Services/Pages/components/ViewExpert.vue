<template>
    <div class="container p-0">
        <div v-if="expert" class="row">
            <div class="col-12">
                <strong class="mr-2">Name:</strong>
                <span>
                    {{ expert.profile && expert.profile.firstName }}
                    {{ expert.profile && expert.profile.lastName }}
                </span>
            </div>
            <div class="col-12">
                <strong class="mr-2">Contact Number:</strong>
                <span>{{ expert.contactNumber }}</span>
            </div>
            <div class="col-12">
                <strong class="mr-2">WhatsApp Number:</strong>
                <span>{{ expert.whatsappNumber }}</span>
            </div>
            <div v-if="expert.idProofType" class="col-12">
                <strong class="mr-2">Id Proof Type:</strong>
                <span>{{ idProofTypes[expert.idProofType] }}</span>
            </div>
            <div v-if="expert.idProofNumber" class="col-12">
                <strong class="mr-2">Id Proof Number:</strong>
                <span>{{ expert.idProofNumber }}</span>
            </div>
            <div v-if="expert.idProofImage" class="col-12 my-3">
                <img class="img" :src="`${s3bucket}/${expert.idProofImage}`" />
            </div>
            <div class="col-12">
                <strong class="mr-2">Expert Verification status:</strong>
                <badge :type="expert.verified ? 'success' : 'danger'">
                    {{ expert.verified ? 'Verified' : 'Not Verified' }}
                </badge>
            </div>
            <div class="col-12 my-3">
                <base-button :type="expert.verified ? 'danger' : 'success'" size="sm">
                    {{ expert.verified ? 'Mark as Not Verified' : 'Mark as Verified' }}
                </base-button>
            </div>
            <div v-if="expert.services && expert.services.length" class="col-12 mt-3">
                <div class="table-responsive">
                    <base-table
                        class="table align-items-center table-flush service-table"
                        thead-classes="thead-dark"
                        :data="expert.services"
                    >
                        <template slot="columns">
                            <th class="text-center text-white">
                                Service Name
                            </th>
                            <th class="text-center text-white">Status</th>
                            <th class="text-center text-white">Actions</th>
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
                            <td>
                                <div class="d-flex justify-content-center">
                                    <base-button
                                        :type="row.serviceExperts.approved ? 'danger' : 'success'"
                                        :icon="row.serviceExperts.approved ? 'ban' : 'check'"
                                        :title="row.serviceExperts.approved ? 'Disapprove' : 'Approve'"
                                        size="sm"
                                        @click="approve(row.serviceId, !row.serviceExperts.approved)"
                                    ></base-button>
                                </div>
                            </td>
                        </template>
                    </base-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        expert: {
            type: Object,
            default: () => {},
        },
    },
    data: () => ({
        idProofTypes: {
            aadhar: 'Aadhar Card',
            license: 'Driving License',
            pan: 'Pan Card',
            voterid: 'Voter Id',
            other: 'Others',
        },
    }),
    computed: {
        s3bucket() {
            return process.env.VUE_APP_S3_BUCKET;
        },
    },
    methods: {
        async approve(serviceId, approved) {
            try {
                const response = await this.$axios({
                    method: 'patch',
                    url: '/services/experts/approve',
                    data: {
                        expertId: this.expert.expertId,
                        serviceId,
                        approved,
                    },
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                    this.$emit('done', { serviceId, approved });
                }
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
<style scoped>
.img {
    width: 100%;
}
</style>
