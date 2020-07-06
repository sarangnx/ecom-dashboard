<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between">
            <h3>Stores</h3>
        </div>
        <div class="card-body p-0 position-relative min__height">
            <div
                v-if="!(stores && stores.length) && !loading"
                class="col-12 p-5 d-flex justify-content-center flex-column align-items-center"
            >
                <div>
                    <small class="p-2">no stores</small>
                    <font-awesome-icon icon="store" />
                </div>
            </div>
            <div v-if="loading" class="over__lay">
                <loading color="dark" />
            </div>
        </div>
        <div v-if="totalPages" class="card-footer">
            <base-pagination v-model="page" :page-count="totalPages" align="center" />
        </div>
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
                this.stores = stores.rows;
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
