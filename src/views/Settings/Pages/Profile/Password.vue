<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-start align-items-center">
            <base-button size="sm" icon="arrow-left" @click="$router.push('/settings')"></base-button>
            <h3 class="m-0">Change Password</h3>
        </div>
        <div class="card-body bg-secondary d-flex flex-row justify-content-start flex-wrap">
            <form class="container">
                <div class="row">
                    <div class="col-lg-6">
                        <h4 class="text-muted">Old Password</h4>
                        <base-input
                            v-model="$v.oldPassword.$model"
                            type="password"
                            classes="input-group-alternative"
                            addon-left-icon="lock-open"
                            autocomplete="old-password"
                            :error="$v.oldPassword.$error ? 'Old Password Required' : null"
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        <h4 class="text-muted">New Password</h4>
                        <base-input
                            v-model="$v.newPassword.$model"
                            type="password"
                            classes="input-group-alternative"
                            addon-left-icon="lock"
                            input-classes="form-control-alternative"
                            autocomplete="new-password"
                            :error="
                                $v.newPassword.$error && !$v.newPassword.required
                                    ? 'Password Required'
                                    : $v.newPassword.$error && !$v.newPassword.minLength
                                    ? 'Minimum 8 Characters Required'
                                    : null
                            "
                        />
                    </div>
                    <div class="col-lg-6">
                        <h4 class="text-muted">Repeat Password</h4>
                        <base-input
                            v-model="$v.repeatPassword.$model"
                            type="password"
                            classes="input-group-alternative"
                            addon-left-icon="lock"
                            input-classes="form-control-alternative"
                            autocomplete="repeat-password"
                            :error="$v.repeatPassword.$error ? `Passwords don't match` : null"
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        <base-button type="success" @click="changePassword">Change Password</base-button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { required, sameAs, minLength } from 'vuelidate/lib/validators';

export default {
    name: 'ChangePassword',
    data: () => ({
        oldPassword: null,
        newPassword: null,
        repeatPassword: null,
        loading: true,
    }),
    validations: {
        oldPassword: {
            required,
        },
        newPassword: {
            required,
            minLength: minLength(8),
        },
        repeatPassword: {
            required,
            sameAsPassword: sameAs('newPassword'),
        },
    },
    computed: {
        ...mapGetters({
            user: 'auth/getUser',
        }),
        userId() {
            return this.user.userId;
        },
    },
    methods: {
        async changePassword() {
            if (this.$v.$invalid) return;

            try {
                const response = await this.$axios({
                    method: 'patch',
                    url: '/users/password',
                    data: {
                        userId: this.userId,
                        oldPassword: this.oldPassword,
                        newPassword: this.newPassword,
                    },
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                }
            } catch (err) {
                const res = err.response;
                if (res && res.status >= 400 && res.status < 500 && res.data.error) {
                    this.$error(res.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }
        },
    },
};
</script>
