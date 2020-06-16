<template>
    <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
            <div class="card bg-secondary shadow border-0">
                <div class="card-body px-lg-5 py-lg-5">
                    <div class="text-center text-muted mb-4">
                        Sign in to Dashboard
                    </div>
                    <form role="form" method="post" action="#" @submit.prevent="login">
                        <base-input
                            v-model="username"
                            class="input-group-alternative mb-3"
                            placeholder="Email"
                            addon-left-icon="envelope-open"
                            :error="$v.username.$error ? 'Email Required' : null"
                        >
                        </base-input>

                        <base-input
                            v-model="password"
                            class="input-group-alternative"
                            placeholder="Password"
                            type="password"
                            addon-left-icon="lock"
                            :error="$v.password.$error ? 'Password Required' : null"
                        >
                        </base-input>

                        <base-checkbox class="custom-control-alternative">
                            <span class="text-muted">Remember me</span>
                        </base-checkbox>
                        <div class="text-center">
                            <base-button
                                type="primary"
                                class="my-4"
                                :loading="loading"
                                :disabled="loading"
                                @click.prevent="login"
                            >
                                Sign in
                            </base-button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-6">
                    <router-link to="/register" class="text-light">
                        <small>Register an account.</small>
                    </router-link>
                </div>
                <div class="col-6 text-right">
                    <router-link to="/reset" class="text-light">
                        <small>Forgot password?</small>
                    </router-link>
                </div>
            </div>
        </div>
        <modal :show.sync="modal" header-classes="pb-0">
            <h5 slot="header">Verify Your OTP</h5>
            <base-input
                v-model="otp"
                class="input-group-alternative"
                placeholder="Password"
                type="text"
                addon-left-icon="lock"
            >
            </base-input>
            <base-button
                type="primary"
                class="my-4"
                :loading="loadingOtp"
                :disabled="loadingOtp"
                @click.prevent="verify"
            >
                Verify
            </base-button>
        </modal>
    </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';

export default {
    name: 'Login',
    data: () => ({
        loadingOtp: false,
        otp: '',
        modal: false,
        username: '',
        password: '',
        loading: false,
    }),
    computed: {
        ...mapGetters({
            isLoggedIn: 'auth/isLoggedIn',
            user: 'auth/getUser',
            isVerified: 'auth/isVerified',
        }),
    },
    validations: {
        username: {
            required,
        },
        password: {
            required,
        },
    },
    methods: {
        async verify() {
            if (this.otp == null || this.otp == '') {
                this.$error('Please enter a valid otp');
            } else {
                try {
                    await this.$store.dispatch('auth/verify', {
                        otp: this.otp,
                        userId: this.user.userId,
                    });

                    if (this.isVerified) {
                        this.$router.push('/');
                    }
                } catch (err) {
                    this.$error('Something went Wrong!');
                }
            }
        },
        async login() {
            this.$v.$touch();

            // Send request once the form is valid
            if (!this.$v.$invalid) {
                this.loading = true;

                try {
                    await this.$store.dispatch('auth/login', {
                        username: this.username,
                        password: this.password,
                    });

                    if (this.user.verified == 0 && this.user.usergroup == 'storeowner') {
                        this.modal = true;
                    } else {
                        if (this.isLoggedIn) {
                            this.$router.push('/');
                        }
                    }
                } catch (err) {
                    this.$error('Something went Wrong!');
                }

                this.loading = false;
            } else {
                this.$error('All fields required.');
            }
        },
    },
};
</script>
