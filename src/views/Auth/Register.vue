<template>
    <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
            <div class="card bg-secondary shadow border-0">
                <div class="card-body px-lg-5 py-lg-5">
                    <div class="card-header text-center bg-transparent">
                        Register
                    </div>
                    <form autocomplete="false">
                        <base-input
                            v-model="$v.username.$model"
                            classes="input-group-alternative"
                            placeholder="Email"
                            addon-left-icon="envelope-open"
                            autocomplete="false"
                            :error="$v.username.$error ? 'Email Required' : null"
                        >
                        </base-input>

                        <base-input
                            v-model="$v.password.$model"
                            classes="input-group-alternative"
                            placeholder="Password"
                            type="password"
                            addon-left-icon="lock"
                            autocomplete="false"
                            :error="
                                $v.password.$error && !$v.password.required
                                    ? 'Password Required'
                                    : $v.password.$error && !$v.password.minLength
                                    ? 'Minimum 8 Characters Required'
                                    : null
                            "
                        >
                        </base-input>

                        <base-input
                            v-model="$v.confirmPassword.$model"
                            classes="input-group-alternative"
                            placeholder="Confirm Password"
                            type="password"
                            addon-left-icon="lock"
                            autocomplete="false"
                            :error="$v.confirmPassword.$error ? `Passwords don't match` : null"
                        >
                        </base-input>

                        <base-input
                            v-if="usergroup.group === 'storeowner'"
                            v-model="$v.phone.$model"
                            classes="input-group-alternative"
                            placeholder="phonenumber"
                            addon-left-icon="phone"
                            autocomplete="false"
                            :error="
                                $v.phone.$error && !$v.phone.required
                                    ? 'Phone Number Required'
                                    : ($v.phone.$error && !$v.phone.minLength) || ($v.phone.$error && !$v.phone.numeric)
                                    ? 'Enter Valid Phone Number'
                                    : null
                            "
                            type="number"
                        >
                        </base-input>

                        <div class="d-flex justify-content-between align-items-center">
                            <span class="mr-3">Register as</span>
                            <base-dropdown class="flex-grow-1">
                                <base-button slot="title" type="default" size="sm" block>
                                    {{ usergroup.name }}
                                    <font-awesome-icon icon="caret-down" pull="right" />
                                </base-button>
                                <a
                                    v-for="(item, index) in usergroups"
                                    :key="index"
                                    class="dropdown-item"
                                    @click="usergroup = item"
                                >
                                    {{ item.name }}
                                </a>
                            </base-dropdown>
                        </div>

                        <div class="text-center">
                            <base-button :loading="loading" type="success" class="my-4" @click="register">
                                Create account
                            </base-button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-6 text-left">
                    <router-link to="/login" class="text-light">
                        <small>Login into your account</small>
                    </router-link>
                </div>
            </div>
        </div>
        <modal :show.sync="modal" body-classes="pt-0" :click-out="false">
            <div slot="header"></div>
            <div class="d-flex flex-column">
                <div class="text-center mb-5">
                    <h3>Account created successfully.</h3>
                </div>
                <base-button type="success" @click="$router.push('/login')">Login</base-button>
            </div>
        </modal>
    </div>
</template>
<script>
import { required, sameAs, minLength, requiredIf, numeric } from 'vuelidate/lib/validators';

export default {
    name: 'Register',
    data: () => ({
        username: '',
        password: '',
        confirmPassword: '',
        usergroup: {},
        usergroups: [
            { name: 'Store Owner', group: 'storeowner' },
            { name: 'Staff', group: 'staff' },
            { name: 'Delivery', group: 'delivery' },
        ],
        phone: '',
        loading: null,
        modal: null,
    }),
    validations: {
        username: {
            required,
        },
        password: {
            required,
            minLength: minLength(8),
        },
        confirmPassword: {
            required,
            sameAsPassword: sameAs('password'),
        },
        phone: {
            required: requiredIf(function () {
                return this.usergroup && this.usergroup.group === 'storeowner';
            }),
            minLength: minLength(10),
            numeric,
        },
    },
    mounted() {
        this.usergroup = this.usergroups[0];
    },
    methods: {
        async register() {
            if (this.$v.$invalid) return;

            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'post',
                    url: '/auth/register',
                    data: {
                        username: this.username,
                        password: this.password,
                        usergroup: this.usergroup.group,
                        ...(this.usergroup && this.usergroup.group === 'storeowner' && { phone: this.phone }),
                    },
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                    this.modal = true;
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
