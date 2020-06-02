<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between">
            <h3>Items</h3>
        </div>
    </div>
</template>
<script>
export default {
    name: 'MasterItems',
    data: () => ({
        categoryId: null,
        page: 1,
        perPage: 12,
        items: [],
        count: 0,
        loading: false,
    }),
    mounted() {
        this.getItems();
    },
    methods: {
        async getItems() {
            this.loading = true;
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/inventory/master',
                    params: {
                        categoryId: this.categoryId,
                        page: this.page,
                        perPage: this.perPage,
                    },
                });

                const data = response.data;
                this.items = data.items.rows;
                this.count = data.items.count;
            } catch (err) {
                this.$error('Unable to get items.');
            }
            this.loading = false;
        },
    },
};
</script>
