<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h3>Banners</h3>
            <div v-if="current">
                <base-dropdown>
                    <base-button slot="title" type="default" size="sm" class="dropdown-toggle">
                        {{ current.name }}
                    </base-button>
                    <a v-for="(item, index) in stores" :key="index" class="dropdown-item" @click="change(item)">
                        {{ item.name }}
                    </a>
                </base-dropdown>
            </div>
            <base-button size="sm" type="primary" icon="plus" @click="addModal = true">Add Banner</base-button>
        </div>
        <div class="card-body">
            <div class="container">
                <div class="d-flex flex-wrap">
                    <div v-for="(banner, index) in banners" :key="index" class="col-12 col-md-6 mb-3">
                        <div class="card shadow h-100">
                            <div class="card-header">
                                <div class="row">
                                    <img v-if="banner.image" :src="`${s3bucket}/${banner.image}`" class="col-12" />
                                    <div v-else class="col-12 text-center">
                                        <font-awesome-icon icon="image" size="5x" />
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="col-12">
                                    <strong>Title: </strong>
                                    <span>{{ banner.name }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <modal :show.sync="addModal" header-classes="pb-0" body-classes="pt-0" :click-out="false">
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
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import AddBanner from './AddBanner';

export default {
    name: 'ViewBanners',
    components: {
        AddBanner,
    },
    data: () => ({
        banners: [],
        addModal: false,
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
        },
    },
};
</script>
