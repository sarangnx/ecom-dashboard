<template>
    <div class="row justify-content-center">
        <div class="col-12 col-md-7">
            <div class="card bg-secondary">
                <div class="card-header text-center">
                    <h2>Register as Professional</h2>
                </div>
                <div class="card-body">
                    <div class="container">
                        <!-- STEP 1 -->
                        <div v-show="step === 1" class="row">
                            <div
                                class="col-12 col-md-6 d-flex align-items-center justify-content-center justify-content-md-end"
                            >
                                <h3 class="mb-0">Select your profession</h3>
                            </div>
                            <div class="col-12 col-md-6 mt-3 mt-md-0">
                                <base-dropdown class="w-100" menu-classes="col-12" tag="div">
                                    <base-button slot="title" type="primary" block>
                                        {{ (selectedService && selectedService.name) || 'Select Profession' }}
                                    </base-button>
                                    <template slot="search">
                                        <base-input
                                            id="search"
                                            v-model="filter"
                                            autocomplete="off"
                                            class="dropdown-item"
                                            placeholder="Search for profession"
                                        />
                                    </template>
                                    <a
                                        v-for="(service, index) in filteredServices"
                                        :key="index"
                                        class="dropdown-item pointer"
                                        @click="selectedService = service"
                                    >
                                        {{ service.name }}
                                    </a>
                                </base-dropdown>
                            </div>
                        </div>
                        <!-- STEP 2 -->
                        <div v-show="step === 2" class="row">
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
                                        class="col-12 col-md-6"
                                        classes="input-group-alternative"
                                        placeholder="State"
                                    />
                                </div>
                            </div>
                        </div>
                        <!-- STEP 3 -->
                        <div v-show="step === 3" class="row">
                            <div class="col-12 mb-3">
                                <h3>Contact Info</h3>
                            </div>
                            <div class="col-12 col-md-6">
                                <h4 class="text-muted">Contact Number</h4>
                                <base-input
                                    v-model="expert.contactNumber"
                                    classes="input-group-alternative"
                                    addon-left-icon="phone"
                                />
                            </div>
                            <div class="col-12 col-md-6">
                                <h4 class="text-muted">WhatsApp Number</h4>
                                <base-input
                                    v-model="expert.whatsappNumber"
                                    classes="input-group-alternative"
                                    :addon-left-icon="{ prefix: 'fab', iconName: 'whatsapp' }"
                                />
                            </div>
                        </div>
                        <!-- STEP 4 -->
                        <div v-show="step === 4" class="row">
                            <div class="col-12 mb-3">
                                <h3>Account Creation</h3>
                            </div>
                            <div class="col-12 col-md-6">
                                <h4 class="text-muted">Email</h4>
                                <base-input
                                    v-model="user.email"
                                    classes="input-group-alternative"
                                    addon-left-icon="envelope-open"
                                />
                            </div>
                            <div class="col-12 col-md-6">
                                <h4 class="text-muted">Phone</h4>
                                <base-input
                                    v-model="user.phone"
                                    classes="input-group-alternative"
                                    addon-left-icon="phone"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="card-footer d-flex"
                    :class="{ 'justify-content-between': step !== 1, 'justify-content-end': step === 1 }"
                >
                    <base-button v-if="step != 1" icon="arrow-left" size="sm" type="danger" @click="previous">
                        Previous
                    </base-button>
                    <base-button
                        v-if="step < 4"
                        icon="arrow-right"
                        icon-position="right"
                        size="sm"
                        type="primary"
                        @click="next"
                    >
                        Next
                    </base-button>
                    <base-button v-if="step === 4" icon="paper-plane" icon-position="right" size="sm" type="success">
                        Submit</base-button
                    >
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data: () => ({
        selectedService: null,
        user: {},
        expert: {},
        permanent: {},
        present: {},
        sameAddress: true,
        step: 1,
        services: [],
        filteredServices: [],
        filter: null,
    }),
    watch: {
        filter() {
            this.filteredServices = this.services.filter((service) => {
                const regex = new RegExp(`${this.filter}`, 'i');
                return regex.test(service.name);
            });
        },
    },
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
                this.filteredServices = Object.assign(this.services);
            } catch (err) {
                this.$error('Unable to get services.');
            }
        },
        previous() {
            this.step = this.step > 1 ? this.step - 1 : this.step;
        },
        next() {
            this.step = this.step < 4 ? this.step + 1 : this.step;
        },
    },
};
</script>
