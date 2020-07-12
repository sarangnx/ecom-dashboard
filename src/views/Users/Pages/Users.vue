<template>
    <div class="card shadow-lg">
        <div class="card-header">
            <h3 class="m-0">Users</h3>
        </div>
        <div class="card-body bg-secondary"></div>
        <div class="card-footer"></div>
    </div>
</template>
<script>
export default {
    data: () => ({
        loading: null,
        users: null,
        page: 1,
        perPage: 10,
        totalPages: null,
        order: 'asc',
    }),
    methods: {
        async listUsers() {
            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/users/list',
                    params: {
                        page: this.page,
                        perPage: this.perPage,
                        order: this.order,
                    },
                });

                const users = response.data.users;
                this.users = users.rows;
                this.totalPages = Math.ceil(users.count / this.perPage);
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
