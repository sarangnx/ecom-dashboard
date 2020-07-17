<template>
    <div class="container-fluid pt-8">
        <div class="row justify-content-center">
            <div class="col-12 col-md-7">
                <div class="card bg-secondary">
                    <div v-if="step !== 6" class="card-header text-center">
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
                                            @click="selectedService = Object.assign({}, service)"
                                        >
                                            {{ service.name }}
                                        </a>
                                    </base-dropdown>
                                </div>
                                <div
                                    v-if="$v.selectedService.$error"
                                    class="text-danger invalid-feedback d-block col-12 col-md-6 offset-md-6"
                                >
                                    <small>You must select a profession</small>
                                </div>
                            </div>
                            <!-- STEP 2 -->
                            <div v-show="step === 2" class="row">
                                <div class="col-12 mb-3">
                                    <h3>Personal Info</h3>
                                </div>
                                <div class="col-12 col-md-6">
                                    <h4 class="text-muted">First Name</h4>
                                    <base-input
                                        v-model="user.firstName"
                                        classes="input-group-alternative"
                                        :error="$v.user && $v.user.firstName.$error ? 'First Name Required' : null"
                                    />
                                </div>
                                <div class="col-12 col-md-6">
                                    <h4 class="text-muted">Last Name</h4>
                                    <base-input v-model="user.lastName" classes="input-group-alternative" />
                                </div>
                                <!-- PRESENT ADDRESS -->
                                <div class="col-12">
                                    <div class="row">
                                        <h4 class="col-12 text-muted">Present Address</h4>
                                        <base-input
                                            v-model="present.house"
                                            class="col-12 col-md-6"
                                            classes="input-group-alternative"
                                            placeholder="House / Flat No."
                                            :error="$v.present.house.$error ? 'House Name Required' : null"
                                        />
                                        <base-input
                                            v-model="present.area"
                                            class="col-12 col-md-6"
                                            classes="input-group-alternative"
                                            placeholder="Area"
                                            :error="$v.present.area.$error ? 'Area Required' : null"
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
                                            :error="$v.present.district.$error ? 'District Required' : null"
                                        />
                                        <base-input
                                            v-model="present.pincode"
                                            type="number"
                                            class="col-12 col-md-6"
                                            classes="input-group-alternative"
                                            placeholder="Pincode"
                                            :error="$v.present.pincode.$error ? 'Pincode Required' : null"
                                        />
                                        <base-input
                                            v-model="present.state"
                                            class="col-12 col-md-6"
                                            classes="input-group-alternative"
                                            placeholder="State"
                                            disabled
                                            :error="$v.present.state.$error ? 'State Required' : null"
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
                                <!-- PERMANENT ADDRESS -->
                                <div v-show="!sameAddress" class="col-12">
                                    <div class="row">
                                        <h4 class="col-12 text-muted">Permanent Address</h4>
                                        <base-input
                                            v-model="permanent.house"
                                            class="col-12 col-md-6"
                                            classes="input-group-alternative"
                                            placeholder="House / Flat No."
                                            :error="$v.permanent.house.$error ? 'House Name Required' : null"
                                        />
                                        <base-input
                                            v-model="permanent.area"
                                            class="col-12 col-md-6"
                                            classes="input-group-alternative"
                                            placeholder="Area"
                                            :error="$v.permanent.area.$error ? 'Area Required' : null"
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
                                            :error="$v.permanent.district.$error ? 'District Required' : null"
                                        />
                                        <base-input
                                            v-model="permanent.pincode"
                                            type="number"
                                            class="col-12 col-md-6"
                                            classes="input-group-alternative"
                                            placeholder="Pincode"
                                            :error="$v.permanent.pincode.$error ? 'Pincode Required' : null"
                                        />
                                        <base-input
                                            v-model="permanent.state"
                                            class="col-12 col-md-6"
                                            classes="input-group-alternative"
                                            placeholder="State"
                                            :error="$v.permanent.state.$error ? 'State Required' : null"
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
                                        type="number"
                                        classes="input-group-alternative"
                                        addon-left-icon="phone"
                                        :error="
                                            $v.user.contactNumber.$error && !$v.user.contactNumber.required
                                                ? 'Contact Number Required'
                                                : $v.user.contactNumber.$error && !$v.user.contactNumber.minLength
                                                ? 'Enter Valid Phone Number'
                                                : null
                                        "
                                    />
                                </div>
                                <div class="col-12 col-md-6">
                                    <h4 class="text-muted">WhatsApp Number</h4>
                                    <base-input
                                        v-model="user.whatsappNumber"
                                        type="number"
                                        classes="input-group-alternative"
                                        :addon-left-icon="{ prefix: 'fab', iconName: 'whatsapp' }"
                                        :error="
                                            $v.user.whatsappNumber.$error && !$v.user.whatsappNumber.required
                                                ? 'WhatsApp Number Required'
                                                : $v.user.whatsappNumber.$error && !$v.user.whatsappNumber.minLength
                                                ? 'Enter Valid Phone Number'
                                                : null
                                        "
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
                                <div
                                    v-if="$v.id.selected.$error"
                                    class="text-danger invalid-feedback d-block col-12 col-md-6"
                                >
                                    <small>You must select a proof type</small>
                                </div>
                                <div v-show="id && id.selected" class="col-12 mb-3">
                                    <div class="d-flex align-items-center">
                                        <h4 class="text-muted mb-0 mr-3">Proof ID Number</h4>
                                        <base-input
                                            v-model="id.idProofNumber"
                                            class="mb-0"
                                            maxlength="30"
                                            :error="$v.id.idProofNumber.$error ? 'ID Proof Number Required' : null"
                                        />
                                    </div>
                                </div>
                                <div v-show="id && id.selected" class="col-12 mb-3">
                                    <div class="d-flex align-items-center">
                                        <h4 class="text-muted mb-0 mr-3" style="white-space: nowrap;">
                                            Id Proof Image
                                        </h4>
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
                                                <base-button
                                                    type="danger"
                                                    icon="trash"
                                                    @click.prevent="removeImage()"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    v-if="id && id.selected && $v.id.image.$error"
                                    class="text-danger invalid-feedback d-block col-12 col-md-6"
                                >
                                    <small>You must select proof image</small>
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
                                        :error="$v.user.username.$error ? 'Username Required.' : null"
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
                                        v-model="$v.user.password.$model"
                                        class="input-group-alternative mb-3"
                                        addon-left-icon="lock"
                                        type="password"
                                        placeholder="Password"
                                        :error="
                                            $v.user.password.$error && !$v.user.password.required
                                                ? 'Password Required'
                                                : $v.user.password.$error && !$v.user.password.minLength
                                                ? 'Minimum 8 Characters Required'
                                                : null
                                        "
                                    ></base-input>
                                </div>
                                <div class="col-12 col-md-6">
                                    <base-input
                                        v-model="$v.user.repeatPassword.$model"
                                        class="input-group-alternative mb-3"
                                        addon-left-icon="lock"
                                        type="password"
                                        placeholder="Repeat Password"
                                        :error="$v.user.repeatPassword.$error ? `Passwords don't match` : null"
                                    ></base-input>
                                </div>
                            </div>
                            <div v-show="step === 6" class="row py-5">
                                <div class="col-12 text-center">
                                    <h3>
                                        Registration Complete <font-awesome-icon icon="check" class="text-success" />
                                    </h3>
                                </div>
                                <div class="col-12 text-center">
                                    <span class="text-muted">
                                        Your service details will be listed in the app only after your profile is
                                        verified by the admin. You can find the details of verification in your profile.
                                    </span>
                                </div>
                                <div class="col-12 text-center">
                                    <small>
                                        You can check your profile by
                                        <a
                                            href="/login"
                                            class="font-weight-bold"
                                            @click.prevent="$router.push('/login')"
                                        >
                                            logging in.
                                        </a>
                                    </small>
                                </div>
                            </div>
                        </form>
                        <div v-if="loading" class="over__lay">
                            <loading color="dark" />
                        </div>
                    </div>
                    <div
                        v-if="step !== 6"
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
    </div>
</template>
<script>
import { required, requiredIf, minLength, sameAs } from 'vuelidate/lib/validators';

export default {
    data: () => ({
        selectedService: {},
        user: { password: null, repeatPassword: null },
        permanent: {},
        present: { state: 'Kerala' },
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
        loading: false,
    }),
    validations: {
        selectedService: { required },
        user: {
            firstName: { required },
            contactNumber: { required, minLength: minLength(10) },
            whatsappNumber: { required, minLength: minLength(10) },
            username: { required },
            password: { required, minLength: minLength(8) },
            repeatPassword: { required, sameAsPassword: sameAs('password') },
        },
        present: {
            house: { required },
            area: { required },
            district: { required },
            pincode: { required },
            state: { required },
        },
        permanent: {
            house: {
                required: requiredIf(function () {
                    return !this.sameAddress;
                }),
            },
            area: {
                required: requiredIf(function () {
                    return !this.sameAddress;
                }),
            },
            district: {
                required: requiredIf(function () {
                    return !this.sameAddress;
                }),
            },
            pincode: {
                required: requiredIf(function () {
                    return !this.sameAddress;
                }),
            },
            state: {
                required: requiredIf(function () {
                    return !this.sameAddress;
                }),
            },
        },
        id: {
            selected: { required },
            idProofNumber: { required },
            image: { required },
        },
    },
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
            // This is required since steps can be changed only if form is valid.
            // Chrome autocomplete cannot be disabled for all versions
            // There is no simpler way, because autocomplete touches the form & makes it invalid.
            switch (this.step) {
                case 1:
                    this.$v.selectedService.$touch();
                    if (this.$v.selectedService.$error) return;
                    break;
                case 2:
                    this.$v.user.firstName.$touch();
                    this.$v.permanent.$touch();
                    this.$v.present.$touch();
                    if (this.$v.user.firstName.$error || this.$v.permanent.$error || this.$v.present.$error) return;
                    break;
                case 3:
                    this.$v.user.contactNumber.$touch();
                    this.$v.user.whatsappNumber.$touch();
                    if (this.$v.user.contactNumber.$error || this.$v.user.whatsappNumber.$error) return;
                    break;
                case 4:
                    this.$v.id.$touch();
                    if (this.$v.id.$error) return;
            }

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
            this.$v.$touch();

            if (this.$v.$invalid) {
                this.$error('Check All Fields');
                return;
            }

            this.loading = true;

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
                presentAddress: JSON.stringify(this.present),
                permanentAddress: this.sameAddress ? JSON.stringify(this.present) : JSON.stringify(this.permanent),
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

            try {
                const response = await this.$axios({
                    method: 'post',
                    url: '/services/register',
                    headers: { 'Content-Type': 'multipart/form-data' },
                    data: formData,
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                    this.step = 6;
                }
            } catch (err) {
                if (err.response && err.response.status === 400 && err.response.data.error) {
                    this.$error(err.response.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }

            this.loading = false;
        },
    },
};
</script>
