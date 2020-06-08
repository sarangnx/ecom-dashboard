<template>
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
                    </div>
                    <div class="card-footer d-flex justify-content-end py-2">
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
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-2 p-1">
                <div class="card shadow h-100 p-3 d-flex justify-content-center align-items-center">
                    <base-button icon="plus" @click="addModal = true">Add Store</base-button>
                </div>
            </div>
        </div>
        <modal :show.sync="addModal" header-classes="pb-0" body-classes="pt-0" :click-out="false">
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
        <modal :show.sync="editModal" header-classes="pb-0" body-classes="pt-0" :click-out="false">
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
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import AddStore from './AddStore';
import EditStore from './EditStore';

export default {
    name: 'Stores',
    components: {
        AddStore,
        EditStore,
    },
    data: () => ({
        stores: [],
        addModal: false,
        editModal: false,
        selectedStore: {},
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
    },
    methods: {
        async getStores(ownerId) {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/stores/list',
                    params: {
                        ownerId,
                    },
                });

                const data = response.data;
                this.stores = data.stores.rows;
            } catch (err) {
                this.$error('Unable to get stores list.');
            }
        },
    },
};
</script>
