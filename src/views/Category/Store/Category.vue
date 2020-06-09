<template>
    <div>
        <div v-if="storeId || (stores && stores.length)" class="card shadow">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h3>Manage Category</h3>
                <div v-if="current">
                    <base-dropdown position="right">
                        <base-button slot="title" size="sm" class="dropdown-toggle">
                            {{ current.name }}
                        </base-button>
                        <a v-for="item in stores" :key="item.storeId" class="dropdown-item" @click="switchStore(item)">
                            {{ item.name }}
                        </a>
                    </base-dropdown>
                </div>
            </div>
            <div class="card-body">
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <category-tree
                                :items="categories"
                                @add-category="addCategory"
                                @edit-category="editCategory"
                                @delete-category="deleteCategory"
                            />
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
                    :store-id="storeId"
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
            <modal :show.sync="deleteModal" header-classes="d-flex align-items-center pb-0" :click-out="false">
                <template slot="header">
                    <h3 class="modal-title">Delete Category</h3>
                </template>
                <delete-category
                    :key="Date.now()"
                    :category="category"
                    @done="
                        deleteModal = false;
                        getCategories();
                    "
                    @close="deleteModal = false"
                />
            </modal>
        </div>
        <div v-else class="card shadow p-2 p-md-5">
            <div class="card-body">
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <h3>You cannot view this page since you don't have any stores currently.</h3>
                            <div class="mb-3">
                                <span class="text-muted">You can return to this page after adding one.</span>
                            </div>
                            <base-button icon="external-link-alt" @click="$router.push('/settings/stores')">
                                Go to settings
                            </base-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';
import DeleteCategory from './DeleteCategory';
import CategoryTree from '../components/CategoryTree';

export default {
    name: 'ManageCategory',
    components: {
        AddCategory,
        EditCategory,
        DeleteCategory,
        CategoryTree,
    },
    data: () => ({
        categories: [],
        addModal: false,
        editModal: false,
        deleteModal: false,
        parent: {},
        category: {},
        flattenCategories: [],
    }),
    computed: {
        ...mapGetters({
            stores: 'stores/stores',
            current: 'stores/current',
        }),
        storeId() {
            if (this.current) {
                return this.current.storeId;
            }
            return null;
        },
    },
    watch: {
        storeId() {
            this.getCategories();
        },
    },
    mounted() {
        this.getCategories();
    },
    methods: {
        async getCategories() {
            const storeId = this.storeId;
            if (!storeId) return;

            try {
                // Get list of all categories and sub categories
                const response = await this.$axios({
                    method: 'get',
                    url: '/category/store/list',
                    params: { storeId },
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
        deleteCategory(categoryId) {
            this.category = this.findCategory(this.categories, categoryId);
            this.deleteModal = true;
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
        switchStore(store) {
            this.change(store);
        },
        ...mapActions({
            change: 'stores/change',
        }),
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
