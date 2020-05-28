<template>
    <div class="card shadow">
        <div class="card-header">
            <h3>Manage Category</h3>
        </div>
        <div class="card-body">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <category-tree :items="categories" />
                    </div>
                    <div class="col-md-12">
                        <div class="p-2">
                            <base-button type="primary">
                                <font-awesome-icon icon="plus" class="mr-2" />
                                Add Category
                            </base-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import CategoryTree from '../components/CategoryTree';

export default {
    name: 'ManageCategory',
    components: {
        CategoryTree,
    },
    data: () => ({
        categories: [],
    }),
    mounted() {
        this.getCategories();
    },
    methods: {
        async getCategories() {
            try {
                // Get list of all categories and sub categories
                const response = await this.$axios({
                    method: 'get',
                    url: '/category/master/list',
                });

                this.categories = response.data.categories.rows;
            } catch (err) {
                this.$error('Unable to get categories');
            }
        },
    },
};
</script>
<style scoped>
.pointer {
    color: #5e72e4;
    font-weight: bold;
}

.pointer:hover {
    color: #233dd2;
    cursor: pointer;
}

.transparent {
    opacity: 0;
}
</style>
