<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between">
            <h3>Stores</h3>
        </div>
        <div class="card-body p-0 position-relative min__height"></div>
    </div>
</template>
<script>
export default {
    data: () => ({
        loading: null,
        page: 1,
        perPage: 10,
        stores: null,
        totalPages: null,
    }),
    mounted() {
        this.getStores();
    },
    methods: {
        async getStores() {
            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/stores/admin',
                    params: {
                        page: this.page,
                        perPage: this.perPage,
                    },
                });

                const stores = response.data.stores;
                this.stores = Object.assign({}, stores.rows);
                this.totalPages = Math.ceil(stores.count / this.perPage);
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
