<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <div class="row"></div>
        </base-header>
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-12">
                    <div class="card shadow">
                        <div class="card-body"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data: () => ({
        userStats: {},
    }),
    mounted() {
        //this.getStats(this.storeId);
        this.getUserStats();
    },
    methods: {
        async getUserStats() {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/users/stats',
                });

                const stats = response.data.stats;
                this.userStats = stats;
            } catch (err) {
                this.$error('Unable to get stats.');
            }
        },
    },
};
</script>
