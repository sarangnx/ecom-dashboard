<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-start align-items-center">
            <base-button size="sm" icon="arrow-left" @click="$router.push('/settings')"></base-button>
            <h3 class="m-0">Stores</h3>
        </div>
        <div class="card-body d-flex flex-row justify-content-start flex-wrap position-relative">
            <div class="container">
                <div class="row">
                    <div class="col-12 d-flex flex-row justify-content-start flex-wrap">
                        <div v-for="(item, index) of stores" :key="index" class="col-md-4 mb-2 p-1">
                            <div class="card shadow h-100">
                                <div class="card-header border-0 d-flex justify-content-center align-items-center">
                                    <img v-if="item.image" :src="`${s3bucket}/${item.image}`" class="col p-0" />
                                    <font-awesome-icon v-else icon="image" size="5x"></font-awesome-icon>
                                </div>
                                <div class="card-body d-flex justify-content-end flex-column py-2">
                                    <div>
                                        <h5 class="d-inline m-0 pr-2">Name:</h5>
                                        <span>{{ item.name }}</span>
                                    </div>
                                    <div v-if="item.area">
                                        <h5 class="d-inline m-0 pr-2">Area:</h5>
                                        <span>{{ item.area }}</span>
                                    </div>
                                    <div v-if="item.city">
                                        <h5 class="d-inline m-0 pr-2">City:</h5>
                                        <span>{{ item.city }}</span>
                                    </div>
                                    <div v-if="item.storeType">
                                        <h5 class="d-inline m-0 pr-2">Store Type:</h5>
                                        <small>{{ item.storeType }}</small>
                                    </div>
                                    <div>
                                        <h5 class="d-inline m-0 pr-2">Delivery Method:</h5>
                                        <small>
                                            {{ item.deliveryAvailable ? 'Pickup + Home Delivery' : 'Pickup only' }}
                                        </small>
                                    </div>
                                </div>
                                <div class="card-footer d-flex flex-wrap justify-content-start py-2">
                                    <base-button
                                        size="sm"
                                        type="danger"
                                        icon="trash"
                                        @click="
                                            deleteModal = true;
                                            selectedStore = item;
                                        "
                                    >
                                        Remove
                                    </base-button>
                                    <base-button
                                        size="sm"
                                        type="success"
                                        icon="edit"
                                        @click="
                                            editModal = true;
                                            selectedStore = item;
                                        "
                                    >
                                        Edit
                                    </base-button>
                                    <base-button
                                        size="sm"
                                        class="mt-2"
                                        icon="clipboard-list"
                                        @click="
                                            locationModal = true;
                                            selectedStore = item;
                                        "
                                    >
                                        Serviceable locations
                                    </base-button>
                                </div>
                            </div>
                        </div>
                        <div v-if="count < limit" class="col-md-4 mb-2 p-1 min__height">
                            <div class="card shadow h-100 p-3 d-flex justify-content-center align-items-center">
                                <base-button icon="plus" @click="addModal = true">Add Store</base-button>
                            </div>
                        </div>
                    </div>
                    <modal
                        :show.sync="addModal"
                        header-classes="pb-0"
                        body-classes="pt-0"
                        :click-out="false"
                        scrollable
                    >
                        <template slot="header">
                            <h4 class="modal-title">Add Store</h4>
                        </template>
                        <add-store
                            :key="Date.now()"
                            :user-id="userId"
                            @done="
                                addModal = false;
                                getStores(userId);
                            "
                        />
                    </modal>
                    <modal
                        :show.sync="editModal"
                        header-classes="pb-0"
                        body-classes="pt-0"
                        :click-out="false"
                        scrollable
                        @close="selectedStore = null"
                    >
                        <template slot="header">
                            <h4 class="modal-title">Edit Store</h4>
                        </template>
                        <edit-store
                            :key="Date.now()"
                            :store="selectedStore"
                            @done="
                                editModal = false;
                                getStores(userId);
                            "
                        />
                    </modal>
                    <modal
                        :show.sync="deleteModal"
                        header-classes="pb-0"
                        body-classes="pt-0"
                        :click-out="false"
                        @close="selectedStore = null"
                    >
                        <template slot="header">
                            <h4 class="modal-title">Delete Store</h4>
                        </template>
                        <delete-store
                            :key="Date.now()"
                            :store="selectedStore"
                            @done="
                                deleteModal = false;
                                getStores(userId);
                            "
                            @close="deleteModal = false"
                        />
                    </modal>
                    <modal
                        :show.sync="locationModal"
                        header-classes="pb-0"
                        body-classes="pt-0"
                        :click-out="false"
                        scrollable
                        @close="selectedStore = null"
                    >
                        <template slot="header">
                            <h4 class="modal-title">Serviceable Locations</h4>
                        </template>
                        <serviceable-locations
                            :key="Date.now()"
                            :store="locationModal ? selectedStore : null"
                            :pincodes="pincodes"
                            @done="locationModal = false"
                        />
                    </modal>
                </div>
            </div>
            <div v-if="loading" class="over__lay">
                <loading />
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import AddStore from './AddStore';
import EditStore from './EditStore';
import DeleteStore from './DeleteStore';
import ServiceableLocations from './ServiceableLocations';

export default {
    name: 'Stores',
    components: {
        AddStore,
        EditStore,
        DeleteStore,
        ServiceableLocations,
    },
    data: () => ({
        stores: [],
        count: null,
        limit: 1, // TODO: make limit dynamic
        addModal: false,
        editModal: false,
        deleteModal: false,
        selectedStore: {},
        locationModal: null,
        pincodes: [],
        loading: false,
    }),
    computed: {
        ...mapGetters({
            user: 'auth/getUser',
        }),
        userId() {
            return this.user.userId;
        },
    },
    mounted() {
        this.getStores(this.userId);
        this.listPincodes();
    },
    methods: {
        ...mapActions({
            init: 'stores/init',
        }),
        async getStores(ownerId) {
            try {
                this.loading = true;

                const response = await this.$axios({
                    method: 'get',
                    url: '/stores/admin',
                    params: {
                        ownerId,
                    },
                });

                const data = response.data;
                this.stores = data.stores.rows;
                const stores = this.stores.map((store) => {
                    return (({ storeId, name }) => ({ storeId, name }))(store);
                });
                this.init(stores);
                this.count = this.stores.length;
            } catch (err) {
                this.$error('Unable to get stores list.');
            }

            this.loading = false;
        },
        async listPincodes(options = {}) {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/pincodes/list',
                    params: {
                        district: options.district,
                    },
                });

                const pincodes = response.data.pincodes;
                this.pincodes = pincodes.rows;
            } catch (err) {
                this.$error('Unable to get pincodes list.');
            }
        },
    },
};
</script>
