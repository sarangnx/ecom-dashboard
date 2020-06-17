<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-start align-items-center">
            <base-button size="sm" icon="arrow-left" @click="$router.push('/settings')"></base-button>
            <h3 class="m-0">Change Password</h3>
        </div>
        <div class="card-body bg-secondary d-flex flex-row justify-content-start flex-wrap">
            <div class="container">
                <div class="row">
                    <div class="col-lg-6">
                        <base-input
                            v-model="oldPassword"
                            type="password"
                            label="Old Password"
                            input-classes="form-control-alternative"
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        <base-input
                            v-model="newPassword"
                            type="password"
                            label="New Password"
                            input-classes="form-control-alternative"
                        />
                    </div>
                    <div class="col-lg-6">
                        <base-input
                            v-model="repeatPassword"
                            type="password"
                            label="Repeat Password"
                            input-classes="form-control-alternative"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ChangePassword',
    data: () => ({
        oldPassword: null,
        newPassword: null,
        repeatPassword: null,
    }),
};
</script>
