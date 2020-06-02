<template>
    <div class="row">
        <div v-if="category" class="col-12 mb-3">
            <span><strong>Category:</strong> {{ category.categoryName }}</span>
        </div>
        <div class="col-12">
            <base-checkbox v-model="recursive" class="mb-3">
                <strong>Delete all sub categories.</strong>
            </base-checkbox>
            <base-checkbox v-model="items" class="mb-3">
                <strong>Remove all items in the category / sub categories.</strong>
            </base-checkbox>
            <base-checkbox v-model="force" class="mb-3">
                <strong>Delete permenantly.</strong>
            </base-checkbox>
        </div>
        <div class="col-12 d-flex justify-content-center">
            <base-button type="success" class="flex-grow-1" @click="$emit('close')">
                Cancel
            </base-button>
            <base-button type="danger" icon="trash" class="flex-grow-1" @click.prevent.stop="deleteCategory">
                Delete Category
            </base-button>
        </div>
        <div v-if="loading" class="over__lay">
            <loading color="dark" />
        </div>
    </div>
</template>
<script>
export default {
    name: 'DeleteCategory',
    props: {
        category: {
            type: Object,
            default: () => {},
        },
    },
    data: () => ({
        recursive: null,
        items: null,
        force: true,
        loading: null,
    }),
    methods: {
        async deleteCategory() {
            if (!this.category) return;
            this.loading = true;

            const data = {
                categoryId: this.category.categoryId,
                recursive: this.recursive,
                items: this.items,
                force: this.force,
            };

            try {
                const response = await this.$axios({
                    method: 'delete',
                    url: '/category/store',
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
