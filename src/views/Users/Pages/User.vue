<template>
    <div class="card shadow-lg min__height">
        <div class="card-header">
            <h3 class="m-0">{{ user ? `${user.firstName} ${user.lastName}` : 'User' }}</h3>
        </div>
        <div class="card-body bg-secondary position-relative">
            <div v-if="user">
                <div class="row">
                    <div class="col-12">
                        <span class="text-sm font-weight-bold mr-2">Name:</span>
                        <span class="text-sm">{{ user.firstName }} {{ user.lastName }}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <span class="text-sm font-weight-bold mr-2">Usergroup:</span>
                        <span class="text-sm">{{ usergroupText[user.usergroup] }}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <span class="text-sm font-weight-bold mr-2">Phone:</span>
                        <span class="text-sm" :class="[{ 'text-muted': !user.phone }]">
                            {{ user.phone || 'Not Provided' }}
                        </span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <span class="text-sm font-weight-bold mr-2">Email:</span>
                        <span class="text-sm" :class="[{ 'text-muted': !user.email }]">
                            {{ user.email || 'Not Provided' }}
                        </span>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h3>Address</h3>
                    </div>
                    <template v-if="user.addresses && user.addresses.permanentAddress">
                        <div class="col-12">
                            <h5 class="m-0 text-muted">Permanent Address</h5>
                        </div>
                        <div class="col-12">
                            <span class="text-sm font-weight-bold mr-2">House:</span>
                            <span class="text-sm" :class="[{ 'text-muted': !user.addresses.permanentAddress.house }]">
                                {{ user.addresses.permanentAddress.house || 'Not Provided' }}
                            </span>
                        </div>
                        <div class="col-12">
                            <span class="text-sm font-weight-bold mr-2">Area:</span>
                            <span class="text-sm" :class="[{ 'text-muted': !user.addresses.permanentAddress.area }]">
                                {{ user.addresses.permanentAddress.area || 'Not Provided' }}
                            </span>
                        </div>
                        <div class="col-12">
                            <span class="text-sm font-weight-bold mr-2">City:</span>
                            <span class="text-sm" :class="[{ 'text-muted': !user.addresses.permanentAddress.city }]">
                                {{ user.addresses.permanentAddress.city || 'Not Provided' }}
                            </span>
                        </div>
                        <div class="col-12">
                            <span class="text-sm font-weight-bold mr-2">District:</span>
                            <span :class="[{ 'text-muted': !user.addresses.permanentAddress.district }, 'text-sm']">
                                {{ user.addresses.permanentAddress.district || 'Not Provided' }}
                            </span>
                        </div>
                        <div class="col-12">
                            <span class="text-sm font-weight-bold mr-2">State:</span>
                            <span class="text-sm" :class="[{ 'text-muted': !user.addresses.permanentAddress.state }]">
                                {{ user.addresses.permanentAddress.state || 'Not Provided' }}
                            </span>
                        </div>
                        <div class="col-12">
                            <span class="text-sm font-weight-bold mr-2">Pincode:</span>
                            <span class="text-sm" :class="[{ 'text-muted': !user.addresses.permanentAddress.pincode }]">
                                {{ user.addresses.permanentAddress.pincode || 'Not Provided' }}
                            </span>
                        </div>
                        <div class="col-12">
                            <span class="text-sm font-weight-bold mr-2">Landmark:</span>
                            <span :class="[{ 'text-muted': !user.addresses.permanentAddress.landmark }, 'text-sm']">
                                {{ user.addresses.permanentAddress.landmark || 'Not Provided' }}
                            </span>
                        </div>
                    </template>
                </div>
            </div>
            <div v-if="!loading && !user" class="col-12 p-5 d-flex justify-content-center align-items-center">
                <div class="text-muted">
                    <span class="text-sm p-2">User Not Found.</span>
                    <font-awesome-icon icon="user" />
                </div>
            </div>
            <div v-if="loading" class="over__lay">
                <loading color="dark" />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data: () => ({
        loading: null,
        user: null,
        usergroupText: {
            superadmin: 'Super Admin',
            admin: 'Admin',
            user: 'Customer',
            storeowner: 'Store Owner',
            staff: 'Staff',
            delivery: 'Devlivery Boy',
            service: 'Service Expert',
        },
    }),
    computed: {
        userId() {
            return this.$route.params ? this.$route.params.userId : null;
        },
    },
    mounted() {
        this.getUser();
    },
    methods: {
        async getUser() {
            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/users/user',
                    params: {
                        userId: this.userId,
                    },
                });

                this.user = response.data.user;
                console.log(this.user);
            } catch (err) {
                const res = err.response;
                if (res && res.status >= 400 && res.status < 500 && res.data.error) {
                    this.$error(res.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }

            this.loading = false;
        },
    },
};
</script>
