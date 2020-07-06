<template>
    <div class="card-body position-relative min__height">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <small class="font-weight-bold mr-2">Store Name:</small>
                    <span>{{ store.name }}</span>
                </div>
                <div class="col-12">
                    <small class="font-weight-bold mr-2">Store Type:</small>
                    <span>{{ storeTypes[store.storeType] }}</span>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-12">
                    <h3 class="text-muted">Address</h3>
                </div>
                <div class="col-12">
                    <small class="font-weight-bold mr-2">Area:</small>
                    <span>{{ store.area }}</span>
                </div>
                <div class="col-12">
                    <small class="font-weight-bold mr-2">City:</small>
                    <span>{{ store.city }}</span>
                </div>
                <div class="col-12">
                    <small class="font-weight-bold mr-2">District:</small>
                    <span>{{ store.district }}</span>
                </div>
                <div class="col-12">
                    <small class="font-weight-bold mr-2">Pincode:</small>
                    <span>{{ store.pincode }}</span>
                </div>
                <div class="col-12">
                    <small class="font-weight-bold mr-2">State:</small>
                    <span>{{ store.state }}</span>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-12">
                    <h3 class="text-muted">Owners</h3>
                </div>
                <template v-for="(owner, index) in store.owners">
                    <div :key="index" class="col-12">
                        <div class="card shadow">
                            <div class="card-body">
                                <div>
                                    <small class="font-weight-bold mr-2">Name:</small>
                                    <span>{{ owner.firstName }} {{ owner.lastName }}</span>
                                </div>
                                <div>
                                    <small class="font-weight-bold mr-2">Phone:</small>
                                    <span>{{ owner.phone }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <div class="row mt-3">
                <div class="col-12">
                    <small class="font-weight-bold mr-2">Store Verification status:</small>
                    <badge :type="store.verified ? 'success' : 'danger'">
                        {{ store.verified ? 'Verified' : 'Not Verified' }}
                    </badge>
                </div>
                <div class="col-12 my-3">
                    <base-button
                        :type="store.verified ? 'danger' : 'success'"
                        size="sm"
                        :disabled="loading"
                        :loading="loading"
                        @click="verify(store.storeId, !store.verified)"
                    >
                        {{ store.verified ? 'Mark as Not Verified' : 'Mark as Verified' }}
                    </base-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        store: {
            type: Object,
            default: () => {},
        },
    },
    data: () => ({
        storeTypes: {
            SUPERMARKET: 'Super Market',
            GROCERY: 'Grocery',
            RESTAURANTS: 'Restaurants',
            MEDICALSHOPS: 'Medical Shops',
            VEGNFRUITS: 'Vegetables & Fruits',
            OTHERS: 'Others',
        },
        loading: false,
    }),
    methods: {
        async verify(storeId, verified) {
            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'patch',
                    url: '/stores/store/verify',
                    data: {
                        storeId,
                        verified,
                    },
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                    this.$emit('verified', { storeId, verified });
                }
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
