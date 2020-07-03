<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8"></base-header>
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    data: () => ({
        expert: null,
    }),
    computed: {
        ...mapGetters({
            user: 'auth/getUser',
        }),
        userId() {
            return this.user ? this.user.userId : null;
        },
    },
    mounted() {
        this.getProfile();
    },
    methods: {
        async getProfile() {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/services/expert',
                    params: {
                        userId: this.userId,
                    },
                });

                this.expert = response.data.expert;
            } catch (err) {
                const res = err.response;
                if (res && res.status >= 400 && res.status < 500 && res.data.error) {
                    this.$error(res.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }
        },
    },
};
</script>
