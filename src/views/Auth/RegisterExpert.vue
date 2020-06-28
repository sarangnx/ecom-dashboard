<template>
    <div class="row justify-content-center">
        <div class="col-12 col-md-7">
            <div class="card bg-secondary">
                <div class="card-header text-center">
                    <h2>Register as Professional</h2>
                </div>
                <div class="card-body">
                    <div class="container">
                        <div v-show="step === 1" class="row">
                            <div class="col-12 mb-3">
                                <h3>Personal Info</h3>
                            </div>
                            <div class="col-12 col-md-6">
                                <h4 class="text-muted">First Name</h4>
                                <base-input v-model="user.firstName" classes="input-group-alternative" />
                            </div>
                            <div class="col-12 col-md-6">
                                <h4 class="text-muted">Last Name</h4>
                                <base-input v-model="user.lastName" classes="input-group-alternative" />
                            </div>
                            <!-- PERMANENT ADDRESS -->
                            <div class="col-12">
                                <div class="row">
                                    <h4 class="col-12 text-muted">Permanent Address</h4>
                                    <base-input
                                        v-model="permanent.house"
                                        class="col-12 col-md-6"
                                        classes="input-group-alternative"
                                        placeholder="House / Flat No."
                                    />
                                    <base-input
                                        v-model="permanent.area"
                                        class="col-12 col-md-6"
                                        classes="input-group-alternative"
                                        placeholder="Area"
                                    />
                                    <base-input
                                        v-model="permanent.city"
                                        class="col-12 col-md-6"
                                        classes="input-group-alternative"
                                        placeholder="City"
                                    />
                                    <base-input
                                        v-model="permanent.landmark"
                                        class="col-12 col-md-6"
                                        classes="input-group-alternative"
                                        placeholder="Landmark"
                                    />
                                    <base-input
                                        v-model="permanent.district"
                                        class="col-12 col-md-6"
                                        classes="input-group-alternative"
                                        placeholder="District"
                                    />
                                    <base-input
                                        v-model="permanent.pincode"
                                        type="number"
                                        class="col-12 col-md-6"
                                        classes="input-group-alternative"
                                        placeholder="Pincode"
                                    />
                                    <base-input
                                        v-model="permanent.state"
                                        type="number"
                                        class="col-12 col-md-6"
                                        classes="input-group-alternative"
                                        placeholder="State"
                                    />
                                </div>
                            </div>
                            <div class="col-12 mb-3">
                                <base-checkbox v-model="sameAddress">
                                    <span class="font-weight-bold">
                                        Present Address & Permanent Address are same.
                                    </span>
                                </base-checkbox>
                            </div>
                            <!-- PRESENT ADDRESS -->
                            <div v-show="!sameAddress" class="col-12">
                                <div class="row">
                                    <h4 class="col-12 text-muted">Present Address</h4>
                                    <base-input
                                        v-model="present.house"
                                        class="col-12 col-md-6"
                                        classes="input-group-alternative"
                                        placeholder="House / Flat No."
                                    />
                                    <base-input
                                        v-model="present.area"
                                        class="col-12 col-md-6"
                                        classes="input-group-alternative"
                                        placeholder="Area"
                                    />
                                    <base-input
                                        v-model="present.city"
                                        class="col-12 col-md-6"
                                        classes="input-group-alternative"
                                        placeholder="City"
                                    />
                                    <base-input
                                        v-model="present.landmark"
                                        class="col-12 col-md-6"
                                        classes="input-group-alternative"
                                        placeholder="Landmark"
                                    />
                                    <base-input
                                        v-model="present.district"
                                        class="col-12 col-md-6"
                                        classes="input-group-alternative"
                                        placeholder="District"
                                    />
                                    <base-input
                                        v-model="present.pincode"
                                        type="number"
                                        class="col-12 col-md-6"
                                        classes="input-group-alternative"
                                        placeholder="Pincode"
                                    />
                                    <base-input
                                        v-model="present.state"
                                        type="number"
                                        class="col-12 col-md-6"
                                        classes="input-group-alternative"
                                        placeholder="State"
                                    />
                                </div>
                            </div>
                            <div class="col-12 d-flex justify-content-end">
                                <base-button icon="arrow-right" icon-position="right" @click="step = 2">
                                    Next
                                </base-button>
                            </div>
                        </div>
                        <div v-show="step === 2" class="row">
                            <div class="col-12 col-md-6">
                                <h4>Email</h4>
                                <base-input
                                    v-model="user.email"
                                    classes="input-group-alternative"
                                    addon-left-icon="envelope-open"
                                />
                            </div>
                            <div class="col-12 col-md-6">
                                <h4>Phone</h4>
                                <base-input
                                    v-model="user.phone"
                                    classes="input-group-alternative"
                                    addon-left-icon="phone"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data: () => ({
        user: {},
        present: {},
        permanent: {},
        sameAddress: true,
        step: 1,
        services: [],
    }),
    mounted() {
        this.getServices();
    },
    methods: {
        async getServices() {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/services/list',
                });

                this.services = response.data.services.rows;
            } catch (err) {
                this.$error('Unable to get services.');
            }
        },
    },
};
</script>
