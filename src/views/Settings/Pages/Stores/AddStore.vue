<template>
    <div class="row">
        <div class="col-12">
            <h4>Store Name</h4>
            <base-input v-model="store.name" placeholder="Store Name" />
        </div>
        <div class="col-12">
            <h4>Store Address</h4>
            <h5 class="text-muted">Area</h5>
            <base-input v-model="store.area" placeholder="Area" />
        </div>
        <div class="col-6">
            <h5 class="text-muted">City</h5>
            <base-input v-model="store.city" placeholder="City" />
        </div>
        <div class="col-6">
            <h5 class="text-muted">District</h5>
            <base-input v-model="store.district" placeholder="District" />
        </div>
        <div class="col-6">
            <h5 class="text-muted">State</h5>
            <base-input v-model="store.state" placeholder="State" />
        </div>
        <div class="col-6">
            <h5 class="text-muted">Pincode</h5>
            <base-input v-model="store.pincode" placeholder="Pincode" />
        </div>
        <div class="col-12">
            <h5 class="text-muted">Phones</h5>
            <div class="d-flex flex-column">
                <div v-for="(value, index) of phones" :key="index" class="d-flex flex-row justify-content-between mb-3">
                    <base-input
                        v-model="phones[index].key"
                        placeholder="Type (like office, help etc.)"
                        :disabled="phones[index].key === 'default'"
                        class="mb-0 mr-2"
                    />
                    <base-input v-model="phones[index].value" placeholder="Phone Number" class="mb-0" />
                    <base-button
                        :disabled="phones[index].key === 'default'"
                        icon="trash"
                        type="danger"
                        class="ml-2"
                        @click="phones.splice(index, 1)"
                    />
                </div>
                <base-button
                    icon="plus"
                    type="default"
                    class="mb-3 align-self-end"
                    size="sm"
                    @click="phones.push({ key: null, value: null })"
                >
                    Add Phone
                </base-button>
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
        store: {},
        phones: [{ key: 'default', value: null }],
        loading: null,
    }),
    methods: {
        async add() {
            console.log(this.phones);
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
