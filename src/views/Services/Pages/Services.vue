<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between">
            <h3>Services</h3>
        </div>
        <div class="card-body p-0 position-relative min__height">
            <template v-if="services && services.length">
                <div class="p-2 d-flex justify-content-between">
                    <div>
                        <small class="mr-1 font-weight-bold">Per Page:</small>
                        <base-dropdown>
                            <base-button slot="title" size="sm" icon="caret-down" icon-position="right">
                                {{ perPage }}
                            </base-button>
                            <a class="dropdown-item" @click="perPage = 10">10</a>
                            <a class="dropdown-item" @click="perPage = 50">50</a>
                            <a class="dropdown-item" @click="perPage = 100">100</a>
                        </base-dropdown>
                    </div>
                    <div>
                        <base-button icon="plus" size="sm" type="success" @click="addModal = true">
                            Add Service
                        </base-button>
                    </div>
                </div>
                <div class="table-responsive">
                    <base-table
                        class="table align-items-center table-flush service-table"
                        thead-classes="thead-dark"
                        :data="services"
                    >
                        <template slot="columns">
                            <th class="text-center text-white name">
                                <a
                                    class="pointer"
                                    @click.prevent="order === 'asc' ? (order = 'desc') : (order = 'asc')"
                                >
                                    Service Name
                                    <font-awesome-icon :icon="order === 'asc' ? 'caret-up' : 'caret-down'" />
                                </a>
                                <!-- <base-button icon="caret-up" size="sm" type="primary"></base-button> -->
                            </th>
                            <th class="text-center text-white desc">Description</th>
                            <th class="text-center text-white actions">Actions</th>
                        </template>
                        <template slot-scope="{ row }">
                            <td class="text-center">
                                <img v-if="row.image" :src="`${s3bucket}/${row.image}`" class="service-thumb mr-2" />
                                <span>{{ row.name }}</span>
                            </td>
                            <td class="desc">
                                <span class="d-block">{{ row.description | truncate }}</span>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">
                                    <base-button type="success" icon="eye" size="sm"></base-button>
                                    <base-button
                                        type="primary"
                                        icon="edit"
                                        size="sm"
                                        @click="
                                            editModal = true;
                                            selectedService = row;
                                        "
                                    ></base-button>
                                    <base-button
                                        type="danger"
                                        icon="trash"
                                        size="sm"
                                        @click="
                                            deleteModal = true;
                                            selectedService = row;
                                        "
                                    ></base-button>
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
        <div v-if="totalPages" class="card-footer">
            <base-pagination v-model="page" :page-count="totalPages" align="center" />
        </div>
        <!-- ADD SERVICE -->
        <modal :show.sync="addModal" header-classes="pb-0" :click-out="false">
            <h4 slot="header" class="modal-title">Add Service</h4>
            <add-service
                :key="Date.now()"
                @done="
                    addModal = false;
                    getServices();
                "
            />
        </modal>
        <!-- EDIT SERVICE -->
        <modal :show.sync="editModal" header-classes="pb-0" :click-out="false">
            <h4 slot="header" class="modal-title">Edit Service</h4>
            <edit-service
                :key="Date.now()"
                :service="selectedService"
                @close="selectedService = null"
                @done="
                    editModal = false;
                    selectedService = null;
                    getServices();
                "
            />
        </modal>
        <!-- DELETE SERVICE -->
        <modal :show.sync="deleteModal" header-classes="pb-0" body-classes="pt-0" :click-out="false">
            <h4 slot="header" class="modal-title">Delete Service</h4>
            <delete-service
                :key="Date.now()"
                :service="selectedService"
                @close="
                    deleteModal = false;
                    selectedService = null;
                "
                @done="
                    deleteModal = false;
                    selectedService = null;
                    getServices();
                "
            />
        </modal>
    </div>
</template>
<script>
import AddService from './components/AddService';
import DeleteService from './components/DeleteService';
import EditService from './components/EditService';

export default {
    name: 'Services',
    components: {
        AddService,
        DeleteService,
        EditService,
    },
    filters: {
        truncate(text) {
            if (!text) return '';
            return `${text.substring(0, 150)}...`;
        },
    },
    data: () => ({
        services: null,
        totalPages: null,
        page: 1,
        order: 'asc',
        loading: null,
        perPage: 10,
        addModal: null,
        deleteModal: null,
        editModal: null,
        selectedService: null,
    }),
    computed: {
        s3bucket() {
            return process.env.VUE_APP_S3_BUCKET;
        },
    },
    watch: {
        page() {
            this.getServices();
        },
        perPage() {
            this.getServices();
        },
        order() {
            this.getServices();
        },
    },
    mounted() {
        this.getServices();
    },
    methods: {
        async getServices() {
            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/services/list',
                    params: {
                        page: this.page,
                        perPage: this.perPage,
                        order: this.order,
                    },
                });

                const services = response.data.services;
                this.services = services.rows;
                this.totalPages = Math.ceil(services.count / this.perPage);
            } catch (err) {
                this.$error('Unable to get items.');
            }

            this.loading = false;
        },
    },
};
</script>
<style scoped lang="scss">
.service-table {
    td.desc {
        min-width: 300px;
        span {
            white-space: break-spaces;
        }
    }
    .name,
    .actions {
        width: 20%;
    }
    .service-thumb {
        max-height: 30px;
    }
}
</style>
