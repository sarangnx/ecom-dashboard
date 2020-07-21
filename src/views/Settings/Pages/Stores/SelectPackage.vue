<template>
    <div class="">
        <div class="col-12">
            <div
                v-for="pack in packages"
                :key="pack.packageId"
                class="card shadow-sm shadow--hover mb-3 pointer"
                :class="[
                    { 'bg-gradient-success text-default': selectedPack && selectedPack.packageId === pack.packageId },
                ]"
                @click="choose(pack)"
            >
                <div class="card-body">
                    <div>
                        <span class="text-xs font-weight-bold mr-2">Pack Name:</span>
                        <span class="text-sm">{{ pack.name }}</span>
                    </div>
                    <div>
                        <span class="text-xs font-weight-bold mr-2">Product Count:</span>
                        <span class="text-sm">{{ pack.count }}</span>
                    </div>
                    <div>
                        <span class="text-xs font-weight-bold mr-2">Validity:</span>
                        <span class="text-sm">{{ pack.duration }} days</span>
                    </div>
                    <div>
                        <span class="text-xs font-weight-bold mr-2">Price:</span>
                        <span class="text-sm">{{ pack.price }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        storeId: {
            type: Number,
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
