<template>
    <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
            <div v-if="!gotCode" :key="1" class="card bg-secondary shadow border-0">
                <fade-transition :duration="200" origin="center center">
                    <div :key="1" class="card-body px-lg-5 py-lg-5">
                        <div class="text-center text-muted mb-4 font-weight-bold">Verify Phone Number</div>
                        <div>
                            <base-input
                                v-model="phone"
                                class="input-group-alternative mb-3"
                                placeholder="Phone"
                                addon-left-icon="phone"
                            ></base-input>
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
                        <div v-if="!verified" class="text-center text-muted mb-4 font-weight-bold">
                            Verify Phone Number
                        </div>
                        <fade-transition :duration="200" origin="center center" group>
                            <div v-if="!verified" :key="1">
                                <base-input
                                    v-if="!phoneSet"
                                    v-model="phone"
                                    class="input-group-alternative mb-3"
                                    placeholder="Phone"
                                    addon-left-icon="phone"
                                ></base-input>
                                <base-input
                                    v-model="otp"
                                    class="input-group-alternative mb-3"
                                    placeholder="OTP"
                                    addon-left-icon="lock"
                                ></base-input>
                                <div class="text-center">
                                    <base-button block type="primary" class="my-4" @click.prevent="verifyPhone">
                                        Verify
                                    </base-button>
                                </div>
                            </div>
                        </fade-transition>
                        <div v-if="verified" class="d-flex align-items-center flex-column">
                            <font-awesome-icon icon="check-circle" :style="{ color: '#2dce89' }" size="4x" />
                            <div class="text-center text-muted mt-3">
                                <base-button type="link" @click="$router.push('/')">Go to Login</base-button>
                            </div>
                        </div>
                        <div v-if="!verified" class="text-center text-muted">
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
    name: 'Verify',
    components: {
        FadeTransition,
    },
    data: () => ({
        phone: null,
        phoneSet: false,
        gotCode: false,
        password: null,
        step: 1,
        verified: false,
        otp: null,
        loading: false,
    }),
    mounted() {
        const { phone } = this.$route.query;
        if (phone) {
            this.phone = phone;
        }
    },
    methods: {
        async sendOtp() {
            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'post',
                    url: `/auth/forgot`,
                    data: {
                        username,
                    },
                });
                if (response.data && response.data.status === 'success') {
                    this.$success('OTP Sent to email');
                    this.gotCode = true;
                    this.usernameSet = true;
                } else {
                    throw new Error('Unable to send email.');
                }
            } catch (err) {
                this.$error('Unable to send email.');
            }

            this.loading = false;
        },
        async verifyPhone() {
            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'post',
                    url: `/auth/verify/phone`,
                    data: {
                        phone: this.phone,
                        code: this.otp,
                    },
                });

                if (response.data && response.data.status === 'success') {
                    this.$success(response.data.message);
                    this.verified = true;
                    this.$store.dispatch('auth/verify', true);
                }
            } catch (err) {
                if (err.response.data && err.response.data.error && err.response.data.error.message) {
                    this.$error(err.response.data.error.message);
                }
            }

            this.loading = false;
        },
    },
};
</script>
