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
        <div class="card-body position-relative min__height">
            <template v-show="items && items.length">
                <fade-transition group tag="div" class="d-flex flex-row justify-content-start flex-wrap">
                    <div v-for="item of items" :key="item.itemId" class="col-md-4 mb-2 p-1">
                        <div class="card shadow-sm shadow--hover">
                            <div class="card-header border-0 d-flex justify-content-center align-items-center">
                                <img v-if="item.image" :src="`${s3bucket}/${item.image}`" class="col p-0" />
                                <font-awesome-icon v-else icon="image" size="5x"></font-awesome-icon>
                            </div>
                            <div class="card-body d-flex justify-content-end flex-column py-2">
                                <div>
                                    <h5 class="d-inline m-0 pr-2">Product Name:</h5>
                                    <span>{{ item.itemName }}</span>
                                </div>
                                <div v-if="item.baseQuantity">
                                    <h5 class="d-inline m-0 pr-2">Quantity:</h5>
                                    <span>{{ parseFloat(item.baseQuantity) }}</span>
                                </div>
                                <div v-if="item.baseUnit">
                                    <h5 class="d-inline m-0 pr-2">Unit:</h5>
                                    <small>{{ item.baseUnit | toUpper }}</small>
                                </div>
                            </div>
                            <div class="card-footer d-flex justify-content-end py-2">
                                <base-button
                                    size="sm"
                                    type="danger"
                                    @click="
                                        selectedItem = item;
                                        deleteModal = true;
                                    "
                                >
                                    Delete
                                </base-button>
                                <base-button
                                    size="sm"
                                    type="primary"
                                    @click="
                                        selectedItem = item;
                                        editModal = true;
                                    "
                                >
                                    Edit
                                </base-button>
                            </div>
                        </div>
                    </div>
                </fade-transition>
            </template>
            <div
                v-if="!(items && items.length) && !loading"
                class="col-12 p-5 d-flex justify-content-center align-items-center"
            >
                <small class="p-2">no items</small>
                <font-awesome-icon icon="inbox" />
            </div>
            <div v-if="loading" class="over__lay">
                <loading color="dark" />
            </div>
        </div>
        <div class="card-footer">
            <base-pagination v-model="page" :page-count="totalPages" align="center"> </base-pagination>
        </div>
        <!-- ADD ITEM -->
        <modal :show.sync="addModal" header-classes="pb-0" body-classes="pt-0" :click-out="false" scrollable>
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
        <!-- EDIT ITEM -->
        <modal :show.sync="editModal" header-classes="pb-0" body-classes="pt-0" :click-out="false" scrollable>
            <template slot="header">
                <h4 class="modal-title">Edit Item</h4>
            </template>
            <edit-item
                :key="Date.now()"
                :categories="categories"
                :edit="selectedItem"
                @done="
                    editModal = false;
                    getItems({ categoryId: categoryId, page: page, perPage: perPage });
                "
            />
        </modal>
        <!-- DELETE ITEM -->
        <modal :show.sync="deleteModal" header-classes="pb-0" body-classes="pt-0" :click-out="false">
            <template slot="header">
                <h4 class="modal-title">Delete Item</h4>
            </template>
            <delete-item
                :key="Date.now()"
                :item="selectedItem"
                @done="
                    deleteModal = false;
                    getItems({ categoryId: categoryId, page: page, perPage: perPage });
                "
            />
        </modal>
    </div>
</template>
<script>
import { FadeTransition } from 'vue2-transitions';
import AddItem from './AddItem';
import EditItem from './EditItem';
import DeleteItem from './DeleteItem';
import CategoryDropdown from '../components/CategoryDropdown';

export default {
    name: 'MasterItems',
    components: {
        AddItem,
        EditItem,
        DeleteItem,
        CategoryDropdown,
        FadeTransition,
    },
    filters: {
        toUpper(string) {
            if (!string) return;
            return string.toUpperCase();
        },
    },
    data: () => ({
        categoryId: null,
        page: 1,
        perPage: 12,
        totalPages: 1,
        items: [],
        categories: [],
        selectedCategory: {},
        selectedItem: {},
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
