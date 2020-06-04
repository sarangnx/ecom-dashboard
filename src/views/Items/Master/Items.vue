<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between">
            <h3>Items</h3>
            <div class="d-flex">
                <div class="mr-2">
                    <base-button size="sm" type="success" @click="addModal = true">
                        Add Item
                        <font-awesome-icon icon="plus" class="ml-2" />
                    </base-button>
                </div>
                <category-dropdown
                    :categories="categories"
                    @category-id="getItems({ categoryId: (categoryId = $event), page: (page = 1), perPage: perPage })"
                />
            </div>
        </div>
        <div class="card-body d-flex flex-row justify-content-start flex-wrap p-2">
            <div v-for="item of items" :key="item.itemId" class="col-md-4 mb-2 p-1">
                <div class="card shadow h-100">
                    <div class="card-header border-0 d-flex justify-content-center align-items-center">
                        <img v-if="item.image" :src="`${s3bucket}/${item.image}`" class="col p-0" />
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
        <div class="card-footer">
            <base-pagination v-model="page" :page-count="totalPages" align="center"> </base-pagination>
        </div>
        <modal :show.sync="addModal" header-classes="pb-0" body-classes="pt-0" :click-out="false">
            <template slot="header">
                <h4 class="modal-title">Add Item</h4>
            </template>
            <add-item
                :key="Date.now()"
                :categories="categories"
                :selected="selectedCategory"
                @done="
                    addModal = false;
                    getItems({ categoryId: categoryId, page: page, perPage: perPage });
                "
            />
        </modal>
    </div>
</template>
<script>
import AddItem from './AddItem';
import CategoryDropdown from '../components/CategoryDropdown';

export default {
    name: 'MasterItems',
    components: {
        AddItem,
        CategoryDropdown,
    },
    data: () => ({
        categoryId: null,
        page: 1,
        perPage: 12,
        totalPages: 1,
        items: [],
        categories: [],
        selectedCategory: {},
        count: 0,
        loading: false,
        deleteId: null,
        editId: null,
        deleteModal: null,
        editModal: null,
        addModal: null,
    }),
    computed: {
        s3bucket() {
            return process.env.VUE_APP_S3_BUCKET;
        },
    },
    watch: {
        page() {
            this.getItems({ categoryId: this.categoryId, page: this.page, perPage: this.perPage });
        },
        categoryId() {
            this.selectedCategory = this.findCategory(this.categories, this.categoryId);
        },
    },
    mounted() {
        this.getItems({ page: this.page, perPage: this.perPage });
        this.getCategories();
    },
    methods: {
        async getItems(options = {}) {
            this.loading = true;
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/inventory/master',
                    params: {
                        categoryId: options.categoryId,
                        page: options.page,
                        perPage: options.perPage,
                    },
                });

                const data = response.data;
                this.items = data.items.rows;
                this.count = data.items.count;
                this.totalPages = Math.ceil(this.count / this.perPage);
            } catch (err) {
                this.$error('Unable to get items.');
            }
            this.loading = false;
        },
        async getCategories() {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/category/master/list',
                });

                const data = response.data;
                this.categories = data.categories.rows;
            } catch (err) {
                this.$error('Unable to get categories.');
            }
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
    },
};
</script>
