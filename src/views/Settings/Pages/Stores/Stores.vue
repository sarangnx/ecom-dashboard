<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-start align-items-center">
            <base-button size="sm" icon="arrow-left" @click="$router.push('/settings')"></base-button>
            <h3 class="m-0">Stores</h3>
        </div>
        <div class="card-body position-relative">
            <fade-transition group tag="div" class="d-flex flex-row justify-content-start flex-wrap">
                <div
                    v-for="(item, index) of stores"
                    :key="index"
                    class="col-12 col-md-6 col-lg-4 col-xl-3 mb-4 px-md-3"
                >
                    <div class="card shadow-sm shadow--hover h-100">
                        <div
                            class="card-header border-0 d-flex justify-content-end align-items-end position-relative"
                            :style="{
                                'background-image': item.image
                                    ? `url(${s3bucket}/${item.image})`
                                    : `url(${placeholder})`,
                                height: '200px',
                                'background-size': 'cover',
                                'background-repeat': 'no-repeat',
                                'background-position': 'center',
                            }"
                        >
                            <div v-if="imageLoading && imageLoading.includes(item.storeId)" class="over__lay">
                                <loading />
                            </div>
                            <input
                                :ref="`file-${index}`"
                                type="file"
                                class="hidden"
                                accept="image/*"
                                @change="uploadImage(item.storeId, $event)"
                            />
                            <base-button
                                icon="edit"
                                size="sm"
                                type="primary"
                                title="Set Store Image"
                                @click="openImage(`file-${index}`)"
                            ></base-button>
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
                        <div class="card-footer d-flex flex-wrap justify-content-between">
                            <base-button
                                size="sm"
                                type="success"
                                icon="eye"
                                @click="$router.push(`/settings/stores/${item.storeId}`)"
                            >
                                View
                            </base-button>
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
                <div
                    v-if="count < limit"
                    :key="count + 1"
                    class="col-12 col-md-6 col-lg-4 col-xl-3 mb-4 px-md-3 min__height"
                >
                    <div class="card shadow-sm shadow--hover h-100 d-flex justify-content-center align-items-center">
                        <base-button icon="plus" @click="addModal = true">Add Store</base-button>
                    </div>
                </div>
            </fade-transition>
            <div v-if="loading" class="over__lay">
                <loading />
            </div>
        </div>
        <modal :show.sync="addModal" header-classes="pb-0" body-classes="pt-0" :click-out="false" scrollable>
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
        <modal :show.sync="deleteModal" header-classes="pb-0" body-classes="pt-0" :click-out="false">
            <h4 slot="header" class="modal-title">Delete Store</h4>
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
        <modal :show.sync="locationModal" header-classes="pb-0" body-classes="pt-0" :click-out="false">
            <h4 slot="header" class="modal-title">Serviceable Locations</h4>
            <serviceable-locations
                :key="Date.now()"
                :store="locationModal ? selectedStore : null"
                :pincodes="pincodes"
                @done="locationModal = false"
                @changed="changePincodes"
            />
        </modal>
    </div>
</template>
<script>
import { FadeTransition } from 'vue2-transitions';
import { mapGetters, mapActions } from 'vuex';
import AddStore from './AddStore';
import DeleteStore from './DeleteStore';
import ServiceableLocations from './ServiceableLocations';

export default {
    name: 'Stores',
    components: {
        AddStore,
        DeleteStore,
        ServiceableLocations,
        FadeTransition,
    },
    data: () => ({
        stores: [],
        count: null,
        limit: 1, // TODO: make limit dynamic
        addModal: false,
        deleteModal: false,
        selectedStore: {},
        locationModal: null,
        pincodes: [],
        loading: false,
        imageLoading: [],
        placeholder:
            'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%20%3Crect%20fill%3D%22%23ddd%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%20%3Ctext%20fill%3D%22rgba%280%2C0%2C0%2C0.5%29%22%20font-family%3D%22sans-serif%22%20font-size%3D%2210%22%20dy%3D%223.5%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%20%3C%2Fsvg%3E',
    }),
    computed: {
        ...mapGetters({
            user: 'auth/getUser',
        }),
        userId() {
            return this.user.userId;
        },
        s3bucket() {
            return process.env.VUE_APP_S3_BUCKET;
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
        async getStores(userId) {
            try {
                this.loading = true;

                const response = await this.$axios({
                    method: 'get',
                    url: '/stores/admin',
                    params: { userId },
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
        changePincodes(pincodes) {
            const index = this.stores.findIndex((store) => store.storeId === this.selectedStore.storeId);
            this.$set(this.stores[index], 'pincodes', pincodes);
        },
        openImage(ref) {
            // open the file selector.
            // [0] is needed because refs inside v-for is converted to an array by default
            // there seems to be no way around it at the moment
            this.$refs[ref][0].click();
        },
        async uploadImage(storeId, event) {
            const image = event.target.files[0];
            if (!image) return;

            let data = {
                image,
                storeId,
            };

            this.imageLoading.push(storeId);

            // Wrap it as FormData.
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });

            try {
                const response = await this.$axios({
                    method: 'post',
                    url: '/stores/store/image',
                    headers: { 'Content-Type': 'multipart/form-data' },
                    data: formData,
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                }
            } catch (err) {
                if (err.response && err.response.status === 400 && err.response.data.error) {
                    this.$error(err.response.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }

            const index = this.imageLoading.indexOf(storeId);
            if (index > -1) this.imageLoading.splice(index, 1);
        },
    },
};
</script>
