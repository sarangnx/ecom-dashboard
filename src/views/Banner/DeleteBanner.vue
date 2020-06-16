<template>
    <div class="row">
        <div v-if="banner" class="col-12 mb-2">
            <span><strong>Title:</strong> {{ banner.name }}</span>
        </div>
        <div class="col-12 mb-3 text-center">
            <small><strong class="text-danger">This action cannot be reverted. Are you sure?</strong></small>
        </div>
        <div class="col-12 d-flex justify-content-center">
            <base-button type="success" class="flex-grow-1" @click="$emit('close')">
                Cancel
            </base-button>
            <base-button type="danger" icon="trash" class="flex-grow-1" @click.prevent.stop="deleteBanner">
                Delete Banner
            </base-button>
        </div>
        <div v-if="loading" class="over__lay">
            <loading color="dark" />
        </div>
    </div>
</template>
<script>
export default {
    name: 'DeleteBanner',
    props: {
        banner: {
            type: Object,
            default: () => {},
        },
    },
    data: () => ({
        loading: null,
    }),
    methods: {
        async deleteBanner() {
            if (!this.banner) return;
            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'delete',
                    url: '/banners',
                    params: {
                        bannerId: this.banner.bannerId,
                    },
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                }

                this.$emit('done');
            } catch (err) {
                if (err.response && err.response.status === 405 && err.response.data.error) {
                    this.$error(err.response.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
