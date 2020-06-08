<template>
    <div class="row">
        <div class="col-12">
            <h4>Store Name</h4>
            <base-input v-model="store.name" placeholder="Store Name" />
        </div>
        <div class="col-12">
            <h4>Store Address</h4>
            <base-input v-model="store.area" placeholder="Area" label="Area" />
        </div>
        <div class="col-6">
            <base-input v-model="store.city" placeholder="City" label="City" />
        </div>
        <div class="col-6">
            <base-input v-model="store.district" placeholder="District" label="District" />
        </div>
        <div class="col-6">
            <base-input v-model="store.state" placeholder="State" label="State" />
        </div>
        <div class="col-6">
            <base-input v-model="store.pincode" placeholder="Pincode" label="Pincode" />
        </div>
        <div class="col-12">
            <div class="d-flex">
                <base-input v-model="store.phones[0]" placeholder="Phone" label="Phone" />
            </div>
        </div>
        <div class="col-12">
            <base-button type="success" icon="plus" block @click.prevent.stop="add()">Add Store</base-button>
        </div>
        <div v-if="loading" class="over__lay">
            <loading color="dark" />
        </div>
    </div>
</template>
<script>
export default {
    name: 'AddModal',
    props: {
        userId: {
            type: [Number, String],
        },
    },
    data: () => ({
        store: {
            phones: [],
        },
        name: null,
        loading: null,
    }),
    methods: {
        async add() {
            return;
            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'post',
                    url: '/inventory/store',
                    data: {
                        ...this.item,
                        categoryId: this.category && this.category.categoryId,
                        storeId: this.storeId,
                    },
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                }

                this.$emit('done');
            } catch (err) {
                if (err.response && err.response.status === 400 && err.response.data.error) {
                    this.$error(err.response.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }

            this.loading = false;
        },
    },
};
</script>
