<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between">
            <h3>Services</h3>
        </div>
        <div class="card-body p-0 position-relative min__height">
            <template v-if="services && services.length">
                <div class="table-responsive">
                    <base-table
                        class="table align-items-center table-flush service-table"
                        thead-classes="thead-dark"
                        :data="services"
                    >
                        <template slot="columns">
                            <th class="text-white">Service Name</th>
                            <th class="text-center text-white">Description</th>
                            <th class="text-center text-white">Actions</th>
                        </template>
                        <template slot-scope="{ row }">
                            <td>
                                <span>{{ row.name }}</span>
                            </td>
                            <td>
                                <span>{{ row.description }}</span>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">
                                    <base-button type="success" icon="eye" size="sm"></base-button>
                                    <base-button type="primary" icon="edit" size="sm"></base-button>
                                    <base-button type="danger" icon="trash" size="sm"></base-button>
                                </div>
                            </td>
                        </template>
                    </base-table>
                </div>
            </template>
            <div
                v-if="!(services && services.length) && !loading"
                class="col-12 p-5 d-flex justify-content-center align-items-center"
            >
                <small class="p-2">no Services</small>
                <font-awesome-icon icon="inbox" />
            </div>
            <div v-if="loading" class="over__lay">
                <loading color="dark" />
            </div>
        </div>
        <div v-if="page" class="card-footer">
            <base-pagination v-model="page" :page-count="totalPages" align="center"> </base-pagination>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Services',
    data: () => ({
        services: null,
        totalPages: null,
        page: 1,
        loading: null,
        perPage: 10,
    }),
    mounted() {
        this.getServices();
    },
    methods: {
        async getServices() {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/services/list',
                });

                const services = response.data.services;
                this.services = services.rows;
                this.totalPages = Math.ceil(services.count / this.perPage);
            } catch (err) {
                this.$error('Unable to get items.');
            }
        },
    },
};
</script>
<style scoped lang="scss">
.service-table {
    table-layout: fixed;
    td {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
