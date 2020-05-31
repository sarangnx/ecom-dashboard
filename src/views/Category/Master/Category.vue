<template>
    <div class="card shadow">
        <div class="card-header">
            <h3>Manage Category</h3>
        </div>
        <div class="card-body">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <category-tree :items="categories" @add-category="addCategory" @edit-category="editCategory" />
                    </div>
                </div>
            </div>
        </div>
        <modal :show.sync="addModal" header-classes="d-flex align-items-center pb-0" :click-out="false">
            <template slot="header">
                <h3 class="modal-title">Add Category</h3>
            </template>
            <add-category
                :key="Date.now()"
                :parent="parent"
                @done="
                    addModal = false;
                    getCategories();
                "
            />
        </modal>
        <modal :show.sync="editModal" header-classes="d-flex align-items-center pb-0" :click-out="false">
            <template slot="header">
                <h3 class="modal-title">Edit Category</h3>
            </template>
            <edit-category
                :key="Date.now()"
                :category="category"
                :categories="flattenCategories"
                @done="
                    editModal = false;
                    getCategories();
                "
            />
        </modal>
    </div>
</template>
<script>
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';
import CategoryTree from '../components/CategoryTree';

export default {
    name: 'ManageCategory',
    components: {
        AddCategory,
        EditCategory,
        CategoryTree,
    },
    data: () => ({
        categories: [],
        addModal: false,
        editModal: false,
        parent: {},
        category: {},
        flattenCategories: [],
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
            this.parent = this.findCategory(this.categories, categoryId);
            this.addModal = true;
        },
        editCategory(categoryId) {
            this.category = this.findCategory(this.categories, categoryId);
            this.flattenCategories = this.flattenCategory(this.categories);
            this.editModal = true;
        },
        findCategory(categories, categoryId) {
            if (categoryId === null) return;

            let found;
            for (let category of categories) {
                if (category.categoryId === categoryId) {
                    found = category;
                    break;
                }

                found = this.findCategory(category.subCategory, categoryId);

                if (found) break;
            }
            return found;
        },
        flattenCategory(categories) {
            let acc = [];
            for (let category of categories) {
                let cat = Object.assign({}, category);
                delete cat.subCategory;
                acc = [...acc, cat, ...this.flattenCategory(category.subCategory)];
            }
            return acc;
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
