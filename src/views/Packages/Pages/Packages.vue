<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between">
            <h3>Packages</h3>
        </div>
        <div class="card-body p-0 position-relative min__height">
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
                        Add Package
                    </base-button>
                </div>
            </div>
            <div class="table-responsive">
                <base-table
                    class="table align-items-center table-flush service-table"
                    thead-classes="thead-dark"
                    :data="packages"
                >
                    <template slot="columns">
                        <th class="text-center text-white">Package Name</th>
                        <th class="text-center text-white">Price</th>
                        <th class="text-center text-white">Product Count</th>
                        <th class="text-center text-white">Duration (days)</th>
                        <th class="text-center text-white">Actions</th>
                    </template>
                    <template slot-scope="{ row }">
                        <td class="text-left name d-flex">
                            {{ row.name }}
                        </td>
                        <td class="text-center">
                            {{ row.price }}
                        </td>
                        <td class="text-center">
                            {{ row.count }}
                        </td>
                        <td class="text-center">
                            {{ row.duration }}
                        </td>
                        <td>
                            <div class="d-flex justify-content-center">
                                <base-button
                                    type="primary"
                                    icon="edit"
                                    size="sm"
                                    @click="
                                        editModal = true;
                                        selectedPack = row;
                                    "
                                ></base-button>
                                <base-button
                                    type="danger"
                                    icon="trash"
                                    size="sm"
                                    @click="
                                        deleteModal = true;
                                        selectedPack = row;
                                    "
                                ></base-button>
                            </div>
                        </td>
                    </template>
                    <div slot="caption" class="col-12 p-5 d-flex justify-content-center align-items-center">
                        <div>
                            <span class="text-sm p-2">no packages</span>
                            <font-awesome-icon icon="box-open" />
                        </div>
                    </div>
                </base-table>
            </div>
            <div v-if="loading" class="over__lay">
                <loading color="dark" />
            </div>
        </div>
        <div v-if="totalPages" class="card-footer">
            <base-pagination v-model="page" :page-count="totalPages" align="center" />
        </div>
        <!-- ADD PACKAGE -->
        <modal :show.sync="addModal" header-classes="pb-0" body-classes="pt-1" :click-out="false" scrollable>
            <h4 slot="header" class="modal-title">Add Package</h4>
            <add-package
                :key="Date.now()"
                @done="
                    addModal = false;
                    getPackages();
                "
            />
        </modal>
        <!-- EDIT PACKAGE -->
        <modal :show.sync="editModal" header-classes="pb-0" body-classes="pt-1" :click-out="false" scrollable>
            <h4 slot="header" class="modal-title">Edit Package</h4>
            <edit-package
                :key="Date.now()"
                :pack="selectedPack"
                @done="
                    editModal = false;
                    selectedPack = null;
                    getPackages();
                "
            />
        </modal>
        <!-- DELETE PACKAGE -->
        <modal :show.sync="deleteModal" header-classes="pb-0" body-classes="pt-1" :click-out="false" scrollable>
            <h4 slot="header" class="modal-title">Delete Package</h4>
            <delete-package
                :key="Date.now()"
                :pack="selectedPack"
                @close="
                    deleteModal = false;
                    selectedPack = null;
                "
                @done="
                    deleteModal = false;
                    selectedPack = null;
                    getPackages();
                "
            />
        </modal>
    </div>
</template>
<script>
import AddPackage from './components/AddPackage';
import EditPackage from './components/EditPackage';
import DeletePackage from './components/DeletePackage';

export default {
    components: {
        AddPackage,
        EditPackage,
        DeletePackage,
    },
    data: () => ({
        page: 1,
        perPage: 10,
        totalPages: null,
        loading: null,
        packages: null,
        addModal: false,
        editModal: false,
        deleteModal: false,
        selectedPack: null,
    }),
    watch: {
        page() {
            this.getPackages();
        },
        perPage() {
            this.getPackages();
        },
    },
    mounted() {
        this.getPackages();
    },
    methods: {
        async getPackages() {
            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/packages/list',
                    params: {
                        page: this.page,
                        perPage: this.perPage,
                    },
                });

                const packages = response.data.packages;
                this.packages = packages.rows;
                this.totalPages = Math.ceil(packages.count / this.perPage);
            } catch (err) {
                const res = err.response;
                if (res && res.status >= 400 && res.status < 500 && res.data.error) {
                    this.$error(res.data.error.message);
                } else {
                    this.$error('Unable to get packages.');
                }
            }

            this.loading = false;
        },
    },
};
</script>
