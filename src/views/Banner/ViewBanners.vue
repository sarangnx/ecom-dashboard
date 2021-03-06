<template>
    <div>
        <div v-if="current" class="mb-4">
            <base-dropdown>
                <base-button slot="title" type="default" size="sm" class="dropdown-toggle">
                    {{ current.name }}
                </base-button>
                <a v-for="(item, index) in stores" :key="index" class="dropdown-item" @click="change(item)">
                    {{ item.name }}
                </a>
            </base-dropdown>
        </div>
        <div v-if="(bannerType === 'store' && storeId) || bannerType === 'main'" class="card shadow">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h3>Banners</h3>
                <base-button size="sm" type="primary" icon="plus" @click="addModal = true">
                    Add Banner
                </base-button>
            </div>
            <div class="card-body position-relative min__height">
                <div v-if="banners && banners.length">
                    <div class="d-flex flex-wrap">
                        <div v-for="(banner, index) in banners" :key="index" class="col-12 col-lg-6 col-xl-4 mb-3">
                            <div class="card shadow-sm shadow--hover h-100">
                                <div class="card-header border-0">
                                    <div class="row">
                                        <img v-if="banner.image" :src="`${s3bucket}/${banner.image}`" class="col-12" />
                                        <div v-else class="col-12 text-center">
                                            <font-awesome-icon icon="image" size="5x" />
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body py-2">
                                    <div class="col-12">
                                        <strong>Title: </strong>
                                        <span>{{ banner.name }}</span>
                                    </div>
                                </div>
                                <div class="card-footer d-flex justify-content-end">
                                    <base-button
                                        size="sm"
                                        type="danger"
                                        icon="trash"
                                        @click="
                                            deleteModal = true;
                                            selectedBanner = banner;
                                        "
                                    >
                                        Delete
                                    </base-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    v-if="!(banners && banners.length) && !loading"
                    class="col-12 p-5 d-flex justify-content-center align-items-center"
                >
                    <small class="p-2">no banners</small>
                    <font-awesome-icon icon="ad" />
                </div>
                <div v-if="loading" class="over__lay">
                    <loading color="dark" />
                </div>
            </div>
            <!-- ADD MODAL -->
            <modal :show.sync="addModal" header-classes="pb-0" body-classes="pt-0" :click-out="false" scrollable>
                <template slot="header">
                    <h4 class="modal-title">Add Banner</h4>
                </template>
                <add-banner
                    :key="Date.now()"
                    :banner-type="bannerType"
                    :store-id="storeId"
                    @done="
                        addModal = false;
                        getBanners();
                    "
                />
            </modal>
            <!-- DELETE MODAL -->
            <modal :show.sync="deleteModal" header-classes="pb-0" body-classes="pt-0" :click-out="false">
                <template slot="header">
                    <h4 class="modal-title">Delete Banner</h4>
                </template>
                <delete-banner
                    :key="Date.now()"
                    :banner="selectedBanner"
                    @done="
                        deleteModal = false;
                        getBanners();
                    "
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
import AddBanner from './AddBanner';
import DeleteBanner from './DeleteBanner';

export default {
    name: 'ViewBanners',
    components: {
        AddBanner,
        DeleteBanner,
    },
    data: () => ({
        banners: [],
        addModal: false,
        deleteModal: false,
        selectedBanner: null,
        loading: false,
    }),
    computed: {
        s3bucket() {
            return process.env.VUE_APP_S3_BUCKET;
        },
        ...mapGetters({
            user: 'auth/getUser',
            stores: 'stores/stores',
            current: 'stores/current',
        }),
        bannerType() {
            return this.user && this.user.usergroup === 'storeowner' ? 'store' : 'main';
        },
        storeId() {
            if (this.current) {
                return this.current.storeId;
            }
            return null;
        },
    },
    watch: {
        storeId() {
            this.getBanners();
        },
    },
    mounted() {
        this.getBanners();
    },
    methods: {
        ...mapActions({
            change: 'stores/change',
        }),
        async getBanners() {
            if (this.bannerType === 'store' && !this.storeId) return;

            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/banners',
                    params: {
                        bannerType: this.bannerType,
                        ...(this.bannerType === 'store' && { storeId: this.storeId }),
                    },
                });

                const banners = response.data.banners;
                this.banners = banners.rows;
            } catch (err) {
                this.$error('Unable to get banners.');
            }

            this.loading = false;
        },
    },
};
</script>
