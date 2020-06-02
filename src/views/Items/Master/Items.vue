<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between">
            <h3>Items</h3>
        </div>
        <div class="card-body d-flex flex-row justify-content-start flex-wrap p-2">
            <div v-for="item of items" :key="item.itemId" class="col-md-4 mb-2 p-1">
                <div class="card shadow h-100">
                    <div class="card-header border-0 d-flex justify-content-center">
                        <img v-if="item.image" :src="`/images/inventory/${item.image}`" class="item-image" />
                        <font-awesome-icon v-else icon="image" size="5x"></font-awesome-icon>
                    </div>
                    <div class="card-body d-flex justify-content-end flex-column">
                        <div>
                            <h5 class="d-inline m-0 pr-2">Product Name:</h5>
                            <span>{{ item.itemName }}</span>
                        </div>
                        <div v-if="item.quantity">
                            <h5 class="d-inline m-0 pr-2">Quantity:</h5>
                            <span>{{ parseFloat(item.quantity) }}</span>
                        </div>
                        <div v-if="item.unit">
                            <h5 class="d-inline m-0 pr-2">Unit:</h5>
                            <span>{{ item.unit }}</span>
                        </div>
                    </div>
                    <div class="card-footer d-flex justify-content-end">
                        <base-button
                            size="sm"
                            type="danger"
                            @click="
                                deleteId = item.itemId;
                                deleteModal = true;
                            "
                        >
                            Delete
                        </base-button>
                        <base-button
                            size="sm"
                            type="primary"
                            @click="
                                editId = item.itemId;
                                editModal = true;
                            "
                        >
                            Edit
                        </base-button>
                    </div>
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
    name: 'MasterItems',
    data: () => ({
        categoryId: null,
        page: 1,
        perPage: 12,
        items: [],
        count: 0,
        loading: false,
        deleteId: null,
        editId: null,
        deleteModal: null,
        editModal: null,
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