<template>
    <modal
        :show="show"
        :click-out="false"
        scrollable
        header-classes="pb-0"
        body-classes="py-2"
        footer-classes="pt-0"
        @update:show="$emit('update:show', $event)"
    >
        <h4 slot="header" class="modal-title">Select a Package</h4>
        <template>
            <div class="col-12">
                <div
                    v-for="pack in packages"
                    :key="pack.packageId"
                    class="card shadow-sm--hover mb-3 pointer"
                    :class="[{ selected: selectedPack && selectedPack.packageId === pack.packageId }]"
                    @click="choose(pack)"
                >
                    <div class="card-body p-3 d-flex flex-column align-items-start">
                        <span class="text-sm font-weight-bold">{{ pack.name }}</span>
                        <badge type="success">
                            <span>{{ pack.count }} Items for {{ pack.duration }} days</span>
                            <span class="text-muted"> &#64; </span>
                            <span class="font-weight-bold">₹{{ pack.price }}</span>
                        </badge>
                    </div>
                </div>
            </div>
            <div v-if="loading" class="over__lay">
                <loading />
            </div>
        </template>
        <div slot="footer">
            <base-button
                size="sm"
                type="success"
                icon="arrow-right"
                icon-position="right"
                :loading="loading"
                @click="selectPack"
            >
                Next
            </base-button>
        </div>
    </modal>
</template>
<script>
export default {
    props: {
        storeId: {
            type: Number,
        },
        show: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        packages: null,
        selectedPack: null,
        loading: false,
    }),
    mounted() {
        this.getPackages();
    },
    methods: {
        async getPackages() {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/packages/list',
                });

                const packages = response.data.packages;
                this.packages = packages.rows;
            } catch (err) {
                const res = err.response;
                if (res && res.status >= 400 && res.status < 500 && res.data.error) {
                    this.$error(res.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }
        },
        choose(pack) {
            if (this.selectedPack && this.selectedPack.packageId === pack.packageId) {
                this.selectedPack = null;
            } else {
                this.selectedPack = pack;
            }
        },
        async selectPack() {
            if (!this.selectedPack) {
                this.$warn('Select a package', { title: 'No Pack Selected' });
                return;
            }

            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'post',
                    url: '/packages/store/add',
                    data: {
                        storeId: this.storeId,
                        packageId: this.selectedPack.packageId,
                    },
                });

                if (response.status === 200) {
                    this.$success('Package Selected.');
                    this.$emit('selected');
                }
            } catch (err) {
                const res = err.response;
                if (res && res.status >= 400 && res.status < 500 && res.data.error) {
                    this.$error(res.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }

            this.loading = false;
        },
    },
};
</script>
<style lang="scss" scoped>
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
.selected {
    border: 1px solid $success;
}
</style>
