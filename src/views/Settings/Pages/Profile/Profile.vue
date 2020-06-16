<template>
    <div class="row">
        <card shadow type="secondary">
            <div slot="header" class="bg-white border-0">
                <div class="d-flex justify-content-between align-items-center">
                    <h3 class="mb-0">Profile</h3>
                    <base-button v-if="!edit" type="primary" size="sm" @click="edit = true">Edit</base-button>
                    <div v-else>
                        <base-button size="sm" type="danger" icon="times" @click="close"></base-button>
                        <base-button size="sm" type="success" icon="save">Save</base-button>
                    </div>
                </div>
            </div>
            <template>
                <div>
                    <h6 class="heading-small text-muted mb-4">User information</h6>
                    <div class="pl-lg-4">
                        <div class="row">
                            <div class="col-lg-6">
                                <base-input
                                    v-model="profile.firstName"
                                    :disabled="!edit"
                                    label="First Name"
                                    input-classes="form-control-alternative"
                                />
                            </div>
                            <div class="col-lg-6">
                                <base-input
                                    v-model="profile.lastName"
                                    :disabled="!edit"
                                    label="Last Name"
                                    input-classes="form-control-alternative"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-6">
                                <base-input
                                    v-model="profile.email"
                                    :disabled="!edit"
                                    label="Email"
                                    input-classes="form-control-alternative"
                                />
                            </div>
                            <div class="col-lg-6">
                                <base-input
                                    v-model="profile.phone"
                                    :disabled="!edit"
                                    label="Phone"
                                    input-classes="form-control-alternative"
                                />
                            </div>
                        </div>
                    </div>
                    <hr class="my-4" />
                    <!-- Address -->
                    <h6 class="heading-small text-muted mb-4">Contact information</h6>
                    <div class="pl-lg-4">
                        <div class="row">
                            <div class="col-md-12">
                                <base-input
                                    v-model="profile.house"
                                    :disabled="!edit"
                                    label="House Name/ Flat No."
                                    input-classes="form-control-alternative"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-6">
                                <base-input
                                    v-model="profile.area"
                                    :disabled="!edit"
                                    label="Area"
                                    input-classes="form-control-alternative"
                                />
                            </div>
                            <div class="col-lg-6">
                                <base-input
                                    v-model="profile.city"
                                    :disabled="!edit"
                                    label="City"
                                    input-classes="form-control-alternative"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-4">
                                <base-input
                                    v-model="profile.district"
                                    :disabled="!edit"
                                    label="District"
                                    input-classes="form-control-alternative"
                                />
                            </div>
                            <div class="col-lg-4">
                                <base-input
                                    v-model="profile.state"
                                    :disabled="!edit"
                                    label="State"
                                    input-classes="form-control-alternative"
                                />
                            </div>
                            <div class="col-lg-4">
                                <base-input
                                    v-model="profile.state"
                                    :disabled="!edit"
                                    label="Pincode"
                                    input-classes="form-control-alternative"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <base-input
                                    v-model="profile.landmark"
                                    :disabled="!edit"
                                    label="Landmark"
                                    input-classes="form-control-alternative"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </card>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'UserProfile',
    data: () => ({
        profile: {},
        original: {},
        edit: false,
        changed: true,
    }),
    computed: {
        ...mapGetters({
            user: 'auth/getUser',
        }),
        userId() {
            return this.user.userId;
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
                    url: '/users/user',
                    params: {
                        userId: this.userId,
                    },
                });

                this.profile = Object.assign({}, response.data.user);
                this.original = Object.assign({}, response.data.user);
            } catch (err) {
                this.$error('Unable to get profile. Please try again later.');
            }
        },
        close() {
            this.profile = Object.assign({}, this.original);
            this.edit = false;
        },
    },
};
</script>
