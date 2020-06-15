<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h3>Banners</h3>
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
        </modal>
    </div>
</template>
<script>
import AddBanner from './AddBanner';

export default {
    name: 'ViewBanners',
    data: () => ({
        banners: [],
        addModal: false,
    }),
    computed: {
        s3bucket() {
            return process.env.VUE_APP_S3_BUCKET;
        },
    },
    mounted() {
        this.getBanners();
    },
    methods: {
        async getBanners() {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/banners',
                    params: {
                        bannerType: 'main',
                    },
                });

                const banners = response.data.banners;
                this.banners = banners.rows;
                console.log(banners);
            } catch (err) {
                this.$error('Unable to get banners.');
            }
        },
    },
};
</script>
