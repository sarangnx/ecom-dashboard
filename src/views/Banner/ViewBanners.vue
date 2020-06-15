<template>
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
</template>
<script>
export default {
    name: 'ViewBanners',
    data: () => ({
        banners: [],
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
