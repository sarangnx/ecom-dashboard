<template>
    <div class="card shadow">
        <div class="card-header">
            <h3>Manage Category</h3>
        </div>
        <div class="card-body">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <category-tree :items="categories" @add-category="addCategory" />
                    </div>
                </div>
            </div>
        </div>
        <modal :show.sync="modal" header-classes="d-flex align-items-center pb-0" :click-out="false">
            <template slot="header">
                <h3 class="modal-title">Add Category</h3>
            </template>
            <add-category :key="Date.now()" :parent="category" />
            <template slot="footer">
                Footer
            </template>
        </modal>
    </div>
</template>
<script>
import AddCategory from './AddCategory';
import CategoryTree from '../components/CategoryTree';

export default {
    name: 'ManageCategory',
    components: {
        AddCategory,
        CategoryTree,
    },
    data: () => ({
        categories: [],
        modal: false,
        categoryId: null,
        category: {},
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
        addCategory(categoryId) {
            this.categoryId = categoryId;
            this.category = this.findCategory(this.categories);
            this.modal = true;
        },
        findCategory(categories) {
            if (this.categoryId === null) return;

            let found;
            for (let category of categories) {
                if (category.categoryId === this.categoryId) {
                    found = category;
                    break;
                }

                found = this.findCategory(category.subCategory);

                if (found) break;
            }
            return found;
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
