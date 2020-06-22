<template>
    <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
            <div v-if="!gotCode" :key="1" class="card bg-secondary shadow border-0">
                <fade-transition :duration="200" origin="center center">
                    <div :key="1" class="card-body px-lg-5 py-lg-5">
                        <div class="text-center text-muted mb-4 font-weight-bold">Reset Password</div>
                        <div>
                            <base-input
                                v-model="username"
                                class="input-group-alternative mb-3"
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
                            <div class="text-center">
                                <base-button block type="primary" class="my-4" @click.prevent="sendOtp">
                                    Send OTP
                                </base-button>
                            </div>
                        </div>
                        <div class="text-center text-muted">
                            <base-button type="link" @click="gotCode = true">Got a code?</base-button>
                        </div>
                    </div>
                </fade-transition>
            </div>
            <div v-else :key="2" class="card bg-secondary shadow border-0">
                <fade-transition :duration="200" origin="center center">
                    <div class="card-body px-lg-5 py-lg-5">
                        <div v-if="step !== 3" class="text-center text-muted mb-4 font-weight-bold">Reset Password</div>
                        <fade-transition :duration="200" origin="center center" group>
                            <div v-if="step === 1" :key="1">
                                <base-input
                                    v-if="!usernameSet"
                                    v-model="username"
                                    class="input-group-alternative mb-3"
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
                                <base-input
                                    v-model="otp"
                                    class="input-group-alternative mb-3"
                                    placeholder="OTP"
                                    addon-left-icon="lock"
                                ></base-input>
                                <div class="text-center">
                                    <base-button block type="primary" class="my-4" @click.prevent="verifyOtp">
                                        Verify
                                    </base-button>
                                </div>
                            </div>
                            <div v-else-if="step === 2" :key="2">
                                <base-input
                                    v-model="password"
                                    class="input-group-alternative mb-3"
                                    placeholder="Password"
                                    type="password"
                                    addon-left-icon="key"
                                ></base-input>
                                <div class="text-center">
                                    <base-button block type="primary" class="my-4" @click.prevent="changePassword">
                                        Change Password
                                    </base-button>
                                </div>
                            </div>
                        </fade-transition>
                        <div v-if="step === 3" class="d-flex align-items-center flex-column">
                            <font-awesome-icon icon="check-circle" :style="{ color: '#2dce89' }" size="4x" />
                            <div class="text-center text-muted mt-3">
                                <base-button type="link" @click="$router.push('/')">Go to Login</base-button>
                            </div>
                        </div>
                        <div v-if="step === 1" class="text-center text-muted">
                            <base-button type="link" @click="gotCode = false">Resend Code</base-button>
                        </div>
                    </div>
                </fade-transition>
            </div>
        </div>
    </div>
</template>
<script>
import { FadeTransition } from 'vue2-transitions';

export default {
    name: 'Reset',
    components: {
        FadeTransition,
    },
    data: () => ({
        username: null,
        usernameSet: false,
        gotCode: false,
        password: null,
        step: 1,
        otp: null,
        loading: false,
        usernameType: 'email',
    }),
    watch: {
        username() {
            const phoneRegEx = /^[0-9]+$/g;

            if (phoneRegEx.test(this.username)) {
                this.usernameType = 'phone';
            } else {
                this.usernameType = 'email';
            }
        },
    },
    methods: {
        async sendOtp() {
            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'post',
                    url: `/auth/forgot`,
                    data: {
                        username: this.username,
                    },
                });

                if (response.data && response.status === 200) {
                    this.$success(`OTP Sent to ${this.usernameType}`);
                    this.gotCode = true;
                    this.usernameSet = true;
                }
            } catch (err) {
                if (err.response && err.response.status === 400 && err.response.data.error) {
                    this.$error(err.response.data.error.message);
                } else {
                    this.$error('Unable to send OTP.');
                }
            }

            this.loading = false;
        },
        async verifyOtp() {
            this.loading = true;
            const username = this.username;
            const otp = this.otp;

            try {
                await this.$axios({
                    method: 'post',
                    url: `/auth/verify`,
                    data: {
                        username,
                        otp,
                    },
                });

                if (response.data && response.data.status === 'success') {
                    this.$success('OTP Verified');
                    this.step = 2;
                } else {
                    throw new Error('Invalid OTP.');
                }
            } catch (err) {
                this.$error('Invalid OTP. Resend OTP and try again.');
            }

            this.loading = false;
        },
        async changePassword() {
            this.loading = true;
            const username = this.username;
            const otp = this.otp;
            const password = this.password;

            try {
                const response = await this.$axios({
                    method: 'post',
                    baseURL: process.env.VUE_APP_API_URL,
                    url: `/auth/changepw`,
                    data: {
                        username,
                        otp,
                        password,
                    },
                });

                if (response.data && response.data.status === 'success') {
                    this.$success('Password changed.');
                    this.step = 3;
                } else {
                    throw new Error('Password not changed.');
                }
            } catch (err) {
                this.$error('Password not changed.', { title: 'Something went wrong.' });
            }

            this.loading = false;
        },
    },
};
</script>
