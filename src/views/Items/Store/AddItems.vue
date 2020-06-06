<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between">
            <div class="d-flex align-items-center">
                <h4 class="m-0 mr-2">Add to Store:</h4>
                <div v-if="current">
                    <base-dropdown>
                        <base-button slot="title" type="primary" size="sm" class="dropdown-toggle">
                            {{ current.name }}
                        </base-button>
                        <a v-for="item in stores" :key="item.storeId" class="dropdown-item" @click="change(item)">
                            {{ item.name }}
                        </a>
                    </base-dropdown>
                </div>
            </div>
            <div class="d-flex">
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
                        <!-- <base-button size="sm" type="danger" icon="trash">
                            Remove
                        </base-button> -->
                        <base-button
                            size="sm"
                            type="success"
                            icon="plus"
                            @click="
                                addModal = true;
                                selectedItem = item;
                            "
                        >
                            Add
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
        <!-- ADD ITEM -->
        <modal :show.sync="addModal" header-classes="pb-0" body-classes="pt-0" :click-out="false">
            <template slot="header">
                <h4 class="modal-title">Add Item</h4>
            </template>
            <add-modal
                :key="Date.now()"
                :selected="selectedItem"
                :categories="storeCategories"
                :store-id="storeId"
                @done="addModal = false"
            />
        </modal>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import AddModal from './AddModal';
import CategoryDropdown from '../components/CategoryDropdown';

export default {
    name: 'AddItems',
    components: {
        AddModal,
        CategoryDropdown,
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
        storeCategories: [],
        selectedItem: {},
        count: 0,
        loading: false,
        addModal: null,
    }),
    computed: {
        s3bucket() {
            return process.env.VUE_APP_S3_BUCKET;
        },
        ...mapGetters({
            stores: 'stores/stores',
            current: 'stores/current',
        }),
        storeId() {
            return this.current.storeId;
        },
    },
    watch: {
        page() {
            this.getItems({ categoryId: this.categoryId, page: this.page, perPage: this.perPage });
        },
        current: {
            deep: true,
            handler() {
                if (this.current && this.current.storeId) {
                    this.getStoreCategories(this.current.storeId);
                }
            },
        },
    },
    mounted() {
        this.getItems({ page: this.page, perPage: this.perPage });
        this.getCategories();
        if (this.current && this.current.storeId) {
            this.getStoreCategories(this.current.storeId);
        }
    },
    methods: {
        ...mapActions({
            change: 'stores/change',
        }),
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
        async getStoreCategories(storeId) {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/category/store/list',
                    params: {
                        storeId,
                    },
                });

                const data = response.data;
                this.storeCategories = data.categories.rows;
            } catch (err) {
                this.$error('Unable to get categories.');
            }
        },
    },
};
</script>