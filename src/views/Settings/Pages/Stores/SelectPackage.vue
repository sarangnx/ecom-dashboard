<template>
    <modal
        :show="show"
        :click-out="false"
        scrollable
        header-classes="pb-0"
        body-classes="pt-2"
        @update:show="$emit('update:show', $event)"
    >
        <h4 slot="header" class="modal-title">Select a Package</h4>
        <div class="">
            <div class="col-12">
                <div
                    v-for="pack in packages"
                    :key="pack.packageId"
                    class="card border-0 shadow-sm--hover ashadow--hover mb-3 pointer"
                    :class="[{ 'bg-default text-white': selectedPack && selectedPack.packageId === pack.packageId }]"
                    @click="choose(pack)"
                >
                    <div class="card-body p-3">
                        <span class="text-sm font-weight-bold">{{ pack.name }}</span>
                        <div class="text-sm">
                            <span>{{ pack.count }} Items for {{ pack.duration }} days</span>
                            <span class="text-muted"> &#64; </span>
                            <span class="font-weight-bold">₹{{ pack.price }}</span>
                        </div>
                    </div>
                </div>
            </div>
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
    },
};
</script>
