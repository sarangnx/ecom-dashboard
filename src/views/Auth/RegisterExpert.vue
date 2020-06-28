<template>
    <div class="row justify-content-center">
        <div class="col-12 col-md-7">
            <div class="card bg-secondary">
                <div class="card-header text-center">
                    <h2>Register as Professional</h2>
                </div>
                <div class="card-body">
                    <form class="container">
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
                                            type="search"
                                            :autocomplete="`${Date.now()}`"
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
                                    v-model="user.contactNumber"
                                    classes="input-group-alternative"
                                    addon-left-icon="phone"
                                />
                            </div>
                            <div class="col-12 col-md-6">
                                <h4 class="text-muted">WhatsApp Number</h4>
                                <base-input
                                    v-model="user.whatsappNumber"
                                    classes="input-group-alternative"
                                    :addon-left-icon="{ prefix: 'fab', iconName: 'whatsapp' }"
                                />
                            </div>
                        </div>
                        <!-- STEP 4 -->
                        <div v-show="step === 4" class="row">
                            <div class="col-12 mb-3">
                                <h3>Proof of Idendity</h3>
                            </div>
                            <div class="col-12 d-flex align-items-center mb-3">
                                <h4 class="text-muted mb-0 mr-3">Select Proof Type</h4>
                                <base-dropdown>
                                    <base-button slot="title" size="sm" icon="caret-down" icon-position="right">
                                        {{ id && id.selected ? id.selected.name : 'None' }}
                                    </base-button>
                                    <a
                                        v-for="(type, index) in idProofTypes"
                                        :key="index"
                                        class="dropdown-item pointer"
                                        @click="id.selected = type"
                                    >
                                        {{ type.name }}
                                    </a>
                                </base-dropdown>
                            </div>
                            <div v-show="id && id.selected" class="col-12 mb-3">
                                <div class="d-flex align-items-center">
                                    <h4 class="text-muted mb-0 mr-3">Proof ID Number</h4>
                                    <base-input v-model="id.idProofNumber" class="mb-0" maxlength="30" />
                                </div>
                            </div>
                            <div v-show="id && id.selected" class="col-12 mb-3">
                                <div class="d-flex align-items-center">
                                    <h4 class="text-muted mb-0 mr-3" style="white-space: nowrap;">Id Proof Image</h4>
                                    <div class="input-group">
                                        <div class="custom-file">
                                            <input
                                                ref="file"
                                                type="file"
                                                class="custom-file-input"
                                                accept="image/*"
                                                @change="loadImage($event)"
                                            />
                                            <label ref="image" class="custom-file-label">Id Proof Image</label>
                                        </div>
                                        <div v-if="id.image" class="input-group-append">
                                            <base-button type="danger" icon="trash" @click.prevent="removeImage()" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- STEP 5 -->
                        <div v-show="step === 5" class="row">
                            <div class="col-12 mb-3">
                                <h3>Account Creation</h3>
                            </div>
                            <div class="col-12 col-md-6 mb-3">
                                <h4 class="text-muted">Username</h4>
                                <base-input
                                    v-model="user.username"
                                    class="input-group-alternative mb-0"
                                    :placeholder="usernameType === 'email' ? 'Email' : 'Phone'"
                                    addon-left-icon="at"
                                >
                                    <template slot="addonLeft">
                                        <base-button
                                            size="sm"
                                            type="primary"
                                            :icon="usernameType === 'email' ? 'at' : 'phone'"
                                            @click="usernameType = usernameType === 'email' ? 'phone' : 'email'"
                                        ></base-button>
                                    </template>
                                </base-input>
                                <small class="text-muted">Phone Number or Email</small>
                            </div>
                        </div>
                        <div v-show="step === 5" class="row">
                            <div class="col-12">
                                <h4 class="text-muted">Password</h4>
                            </div>
                            <div class="col-12 col-md-6">
                                <base-input
                                    v-model="user.password"
                                    class="input-group-alternative mb-3"
                                    addon-left-icon="lock"
                                    type="password"
                                    placeholder="Password"
                                ></base-input>
                            </div>
                            <div class="col-12 col-md-6">
                                <base-input
                                    v-model="user.repeatPassword"
                                    class="input-group-alternative mb-3"
                                    addon-left-icon="lock"
                                    type="password"
                                    placeholder="Repeat Password"
                                ></base-input>
                            </div>
                        </div>
                    </form>
                </div>
                <div
                    class="card-footer d-flex"
                    :class="[step === 1 ? 'justify-content-end' : 'justify-content-between']"
                >
                    <base-button v-if="step != 1" icon="arrow-left" size="sm" type="danger" @click="previous">
                        Previous
                    </base-button>
                    <base-button
                        v-if="step < 5"
                        icon="arrow-right"
                        icon-position="right"
                        size="sm"
                        type="primary"
                        @click="next"
                    >
                        Next
                    </base-button>
                    <base-button
                        v-if="step === 5"
                        icon="paper-plane"
                        icon-position="right"
                        size="sm"
                        type="success"
                        @click="register"
                    >
                        Submit
                    </base-button>
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
        permanent: {},
        present: {},
        sameAddress: true,
        step: 1,
        services: [],
        filteredServices: [],
        filter: null,
        idProofTypes: [
            { name: 'Aadhar Card', value: 'aadhar' },
            { name: 'Driving License', value: 'license' },
            { name: 'Pan Card', value: 'pan' },
            { name: 'Voter Id', value: 'voterid' },
            { name: 'Others', value: 'other' },
        ],
        id: { selected: null, image: null },
        usernameType: 'email',
    }),
    watch: {
        filter() {
            this.filteredServices = this.services.filter((service) => {
                const regex = new RegExp(`${this.filter}`, 'i');
                return regex.test(service.name);
            });
        },
        user: {
            deep: true,
            handler() {
                const phoneRegEx = /^[0-9]+$/g;

                if (phoneRegEx.test(this.user.username)) {
                    this.usernameType = 'phone';
                } else {
                    this.usernameType = 'email';
                }
            },
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
            this.step = this.step < 5 ? this.step + 1 : this.step;
        },
        loadImage(event) {
            this.id.image = event.target.files[0];
            this.$refs.image.innerHTML = event.target.files[0] ? event.target.files[0].name : 'Id Proof Image';
        },
        removeImage() {
            this.id.image = null;
            this.$refs.file.value = this.$refs.file.defaultValue;
            this.$refs.image.innerHTML = 'Id Proof Image';
        },
        async register() {
            // prepare data
            let data = {
                serviceId: this.selectedService.serviceId,
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                username: this.user.username,
                password: this.user.password,
                contactNumber: this.user.contactNumber,
                whatsappNumber: this.user.whatsappNumber,
                idProofType: this.id.selected.value,
                idProofNumber: this.id.idProofNumber,
                idProofImage: this.id.image,
                permanentAddress: this.permanent,
                ...(!this.sameAddress && { presentAddress: this.present }),
            };

            // remove keys with null or undefined
            for (let key in data) {
                if (!data[key]) delete data[key];
            }

            // Wrap it as FormData.
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });
        },
    },
};
</script>
