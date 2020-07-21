<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between align-items-center">
            <div class="d-flex">
                <base-button size="sm" icon="arrow-left" @click="$router.push('/settings/stores')"></base-button>
                <h3 class="m-0">Store</h3>
            </div>
            <base-button v-if="!edit" type="primary" size="sm" @click="edit = true">Edit</base-button>
            <div v-else>
                <base-button v-show="!loading" size="sm" type="danger" icon="times" @click="close"></base-button>
                <base-button :loading="loading" :disabled="loading" size="sm" type="success" icon="save" @click="save">
                    Save
                </base-button>
            </div>
        </div>
        <div class="card-body position-relative min__height">
            <div class="row">
                <div class="col-12">
                    <base-input
                        v-model="store.name"
                        :disabled="!edit"
                        label="Store Name"
                        :input-classes="['form-control-alternative', { 'bg-white shadow-none': !edit }]"
                        :classes="['d-flex', { 'flex-row align-items-baseline': !edit }, { 'flex-column': edit }]"
                    />
                </div>
            </div>
            <div v-if="loading" class="over__lay">
                <loading />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data: () => ({
        loading: false,
        edit: false,
        store: {},
        original: null,
    }),
    mounted() {
        const storeId = this.$route.params ? this.$route.params.storeId : null;
        if (storeId) {
            this.getStore(storeId);
        }
    },
    methods: {
        async getStore(storeId) {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/stores/store',
                    params: { storeId },
                });

                this.store = Object.assign({}, response.data.store);
                this.original = Object.assign({}, response.data.store);
            } catch (err) {
                const res = err.response;
                if (res && res.status >= 400 && res.status < 500 && res.data.error) {
                    this.$error(res.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }
        },
        close() {
            this.store = Object.assign({}, this.original);
            this.edit = false;
        },
        async save() {},
    },
};
</script>
