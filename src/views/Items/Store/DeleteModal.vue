<template>
    <div class="row">
        <div v-if="item && item.itemDetails" class="col-12 mb-3">
            <span><strong>Item:</strong> {{ item.itemDetails.itemName }}</span>
        </div>
        <div class="col-12">
            <base-checkbox v-model="force" class="mb-3">
                <strong>Delete permenantly.</strong>
            </base-checkbox>
        </div>
        <div class="col-12 d-flex justify-content-center">
            <base-button type="success" class="flex-grow-1" @click="$emit('close')">
                Cancel
            </base-button>
            <base-button type="danger" icon="trash" class="flex-grow-1" @click.prevent.stop="deleteItem">
                Delete Item
            </base-button>
        </div>
        <div v-if="loading" class="over__lay">
            <loading color="dark" />
        </div>
    </div>
</template>
<script>
export default {
    name: 'DeleteModal',
    props: {
        item: {
            type: Object,
            default: () => {},
        },
    },
    data: () => ({
        force: true,
        loading: null,
    }),
    methods: {
        async deleteItem() {
            if (!this.item) return;
            this.loading = true;

            const data = {
                storeItemId: this.item.storeItemId,
                force: this.force,
            };

            try {
                const response = await this.$axios({
                    method: 'delete',
                    url: '/inventory/store',
                    data,
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                }

                this.$emit('done');
            } catch (err) {
                if (err.response && err.response.status === 405 && err.response.data.error) {
                    this.$error(err.response.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
