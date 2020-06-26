<template>
    <div class="row">
        <div v-if="service" class="col-12 mb-3">
            <span><strong>Service:</strong> {{ service.name }}</span>
        </div>
        <div class="col-12">
            <base-checkbox v-model="force" class="mb-3">
                <strong>Delete permenantly.</strong>
            </base-checkbox>
        </div>
        <div class="col-12 d-flex justify-content-center">
            <base-button type="success" class="flex-grow-1" @click="$emit('close')">
                Cancel
            </base-button>
            <base-button type="danger" icon="trash" class="flex-grow-1" @click.prevent.stop="deleteService">
                Delete Service
            </base-button>
        </div>
        <div v-if="loading" class="over__lay">
            <loading color="dark" />
        </div>
    </div>
</template>
<script>
export default {
    name: 'DeleteService',
    props: {
        service: {
            type: Object,
            default: () => {},
        },
    },
    data: () => ({
        force: true,
        loading: null,
    }),
    methods: {
        async deleteService() {
            if (!this.service) return;

            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'delete',
                    url: '/services/service',
                    params: {
                        serviceId: this.service.serviceId,
                        force: this.force,
                    },
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                }

                this.$emit('done');
            } catch (err) {
                const res = err.response;
                if (res && res.status >= 400 && res.status < 500 && res.data.error) {
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
