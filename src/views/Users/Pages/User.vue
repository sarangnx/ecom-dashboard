<template>
    <div class="card shadow-lg min__height">
        <div class="card-header">
            <h3 class="m-0">User</h3>
        </div>
        <div class="card-body bg-secondary p-0 position-relative">
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
