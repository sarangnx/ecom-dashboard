<template>
    <div>
        <div v-if="storeId || (stores && stores.length)" class="card shadow">
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
                        @category-id="
                            getItems({ categoryId: (categoryId = $event), page: (page = 1), perPage, storeId })
                        "
                    />
                </div>
            </div>
            <div class="card-body position-relative min__height">
                <template v-if="items && items.length">
                    <fade-transition group tag="div" class="d-flex flex-row justify-content-start flex-wrap">
                        <div v-for="item of items" :key="item.itemId" class="col-md-6 col-lg-4 col-xl-3 mb-4 px-md-3">
                            <div class="card shadow-sm shadow--hover h-100">
                                <div
                                    class="card-header border-0"
                                    :style="{
                                        'background-image': item.image
                                            ? `url(${s3bucket}/${item.image})`
                                            : `url(${placeholder})`,
                                        height: '200px',
                                        'background-size': 'cover',
                                        'background-repeat': 'no-repeat',
                                        'background-position': 'center',
                                    }"
                                ></div>
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
                                        v-if="item.storeItems && item.storeItems.length"
                                        size="sm"
                                        type="danger"
                                        icon="trash"
                                        @click="
                                            deleteModal = true;
                                            selectedItem = item;
                                            selectedItem.itemDetails = item;
                                            selectedItem.storeItemId =
                                                item.storeItems && item.storeItems[0].storeItemId;
                                        "
                                    >
                                        Remove
                                    </base-button>
                                    <base-button
                                        v-else
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
                    </fade-transition>
                </template>
                <div
                    v-if="!(items && items.length) && !loading"
                    class="col-12 p-5 d-flex justify-content-center align-items-center"
                >
                    <small class="p-2">no items in master inventory</small>
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
                <add-modal
                    :key="Date.now()"
                    :selected="selectedItem"
                    :categories="storeCategories"
                    :store-id="storeId"
                    @done="
                        addModal = false;
                        getItems({ categoryId, page, perPage, storeId });
                    "
                />
            </modal>
            <!-- DELETE ITEM -->
            <modal :show.sync="deleteModal" header-classes="pb-0" body-classes="pt-0" :click-out="false">
                <template slot="header">
                    <h4 class="modal-title">Delete Item</h4>
                </template>
                <delete-modal
                    :key="Date.now()"
                    :item="selectedItem"
                    @done="
                        deleteModal = false;
                        getItems({ categoryId, page, perPage, storeId });
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
import { FadeTransition } from 'vue2-transitions';
import { mapGetters, mapActions } from 'vuex';
import AddModal from './AddModal';
import DeleteModal from './DeleteModal';
import CategoryDropdown from '../components/CategoryDropdown';

export default {
    name: 'AddItems',
    components: {
        AddModal,
        DeleteModal,
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
        storeCategories: [],
        selectedItem: {},
        count: 0,
        loading: false,
        addModal: null,
        deleteModal: null,
        placeholder:
            'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%20%3Crect%20fill%3D%22%23ddd%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%20%3Ctext%20fill%3D%22rgba%280%2C0%2C0%2C0.5%29%22%20font-family%3D%22sans-serif%22%20font-size%3D%2210%22%20dy%3D%223.5%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%20%3C%2Fsvg%3E',
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
            if (this.current) {
                return this.current.storeId;
            }
            return null;
        },
    },
    watch: {
        page() {
            this.getItems({
                categoryId: this.categoryId,
                page: this.page,
                perPage: this.perPage,
                storeId: this.storeId,
            });
        },
        current: {
            deep: true,
            handler() {
                if (this.current && this.current.storeId) {
                    this.getStoreCategories(this.current.storeId);
                    this.getItems({
                        categoryId: this.categoryId,
                        page: this.page,
                        perPage: this.perPage,
                        storeId: this.storeId,
                    });
                }
            },
        },
    },
    mounted() {
        this.getItems({ page: this.page, perPage: this.perPage, storeId: this.storeId });
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
                        storeId: options.storeId,
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
