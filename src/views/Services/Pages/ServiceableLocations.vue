<template>
    <div class="container-fluid pt-4 pt-md-8">
        <div class="row">
            <div class="col-12">
                <div class="card shadow-lg">
                    <div class="card-header d-flex justify-content-start align-items-center">
                        <h3 class="m-0">Serviceable Locations</h3>
                    </div>
                    <div class="card-body bg-secondary position-relative">
                        <div class="row">
                            <div class="col-12">
                                <base-dropdown class="w-100" menu-classes="col-12" tag="div">
                                    <base-button slot="title" type="primary" block>
                                        Add Pincodes
                                        <font-awesome-icon icon="caret-down" pull="right" />
                                    </base-button>
                                    <template slot="search">
                                        <base-input
                                            id="search"
                                            v-model="filter"
                                            autocomplete="off"
                                            class="dropdown-item"
                                            placeholder="Search for pincodes"
                                        />
                                    </template>
                                    <a
                                        v-for="(pincode, index) in filteredPincodes"
                                        :key="index"
                                        class="dropdown-item pointer"
                                        @click="add(pincode)"
                                    >
                                        {{ pincode.pincode }} - {{ pincode.officeName }}
                                    </a>
                                </base-dropdown>
                            </div>
                            <div
                                v-if="selectedPincodes && selectedPincodes.length"
                                class="col-12 mt-3 d-flex flex-wrap"
                            >
                                <badge
                                    v-for="(pincode, index) in selectedPincodes"
                                    :key="index"
                                    class="m-2 text-wrap d-flex align-items-center"
                                >
                                    <span class="px-2 text-capitalize font-weight-normal">
                                        <strong>{{ pincode.pincode }}</strong> - {{ pincode.officeName }}
                                    </span>
                                    <base-button icon="times" size="sm" @click="remove(pincode)" />
                                </badge>
                            </div>
                            <div v-else class="col-12 mt-3 text-center py-5">
                                <small>Add Pincodes from the dropdown list above.</small>
                            </div>
                            <div v-if="changed" class="col-12 mt-4">
                                <base-button block type="success" icon="save" @click="save">
                                    Save Changes
                                </base-button>
                            </div>
                        </div>
                        <div v-if="loading" class="over__lay">
                            <loading />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    name: 'ServiceableLocations',
    data: () => ({
        expert: null,
        pincodes: null,
        expertPincodes: [],
        removedPincodes: [],
        newPincodes: [],
        filter: null,
        filteredPincodes: [],
        changed: false,
        loading: false,
    }),
    computed: {
        selectedPincodes() {
            return this.expertPincodes.concat(this.newPincodes);
        },
        ...mapGetters({
            user: 'auth/getUser',
        }),
        userId() {
            return this.user ? this.user.userId : null;
        },
    },
    watch: {
        filter() {
            this.filteredPincodes = this.pincodes.filter((pincode) => {
                const regex = new RegExp(`${this.filter}`, 'i');
                return regex.test(pincode.officeName) || regex.test(pincode.pincode);
            });
        },
    },
    async mounted() {
        await this.getProfile();
        await this.listPincodes();
        await this.getexpertPincodes();
        this.filteredPincodes = Object.assign({}, this.pincodes);
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
        async listPincodes(options = {}) {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/pincodes/list',
                    params: {
                        district: options.district,
                    },
                });

                const pincodes = response.data.pincodes;
                this.pincodes = pincodes.rows;
            } catch (err) {
                this.$error('Unable to get pincodes list.');
            }
        },
        async getexpertPincodes() {
            const response = await this.$axios({
                method: 'get',
                url: '/pincodes/list',
                params: {
                    expertId: this.expert && this.expert.expertId,
                },
            });

            const pincodes = response.data.pincodes;
            this.expertPincodes = pincodes.rows;
        },
        remove(pincode) {
            let index = this.newPincodes.findIndex((item) => item.pinId === pincode.pinId);
            // if pincode to be removed is in newPincodes just splice
            if (index !== -1) {
                this.newPincodes.splice(index, 1);
                return;
            }

            index = this.expertPincodes.findIndex((item) => item.pinId === pincode.pinId);
            // if it is in expertPincodes, add it to removedPincodes list
            if (index !== -1) {
                const removed = this.expertPincodes.splice(index, 1);
                this.removedPincodes = this.removedPincodes.concat(removed);
                this.changed = true;
            }
        },
        add(pincode) {
            const index = this.selectedPincodes.findIndex((item) => item.pinId === pincode.pinId);
            if (index === -1) {
                this.newPincodes.push(pincode);
                this.changed = true;
            }
        },
        async save() {
            let addIds = this.newPincodes.map((item) => item.pinId);
            let removeIds = this.removedPincodes.map((item) => item.pinId);
            // Ids both in add and remove
            const common = removeIds.filter((item) => addIds.includes(item));

            if (common && common.length) {
                // remove Ids in common from both addIds and removeIds
                addIds = addIds.filter((item) => !common.includes(item));
                removeIds = removeIds.filter((item) => !common.includes(item));
            }

            let error = false;

            this.loading = true;
            // send request to add pincodes if given
            if (addIds && addIds.length) {
                try {
                    const response = await this.$axios({
                        method: 'post',
                        url: '/pincodes/expert',
                        data: {
                            pincodes: addIds,
                            expertId: this.expert.expertId,
                        },
                    });

                    if (response.status === 200 && response.data.message) {
                        this.$success(response.data.message);
                        this.expertPincodes = this.expertPincodes.concat(this.newPincodes);
                        this.newPincodes = [];
                    }
                } catch (err) {
                    if (err.response && err.response.status === 400 && err.response.data.error) {
                        this.$error(err.response.data.error.message);
                    } else {
                        this.$error('Something went wrong. Please try again later.');
                    }
                    error = true;
                }
            }

            // send request to delete pincodes if given
            if (removeIds && removeIds.length) {
                try {
                    const response = await this.$axios({
                        method: 'delete',
                        url: '/pincodes/expert',
                        data: {
                            pincodes: removeIds,
                            expertId: this.expert.expertId,
                        },
                    });

                    if (response.status === 200 && response.data.message) {
                        this.$success(response.data.message);
                        this.removedPincodes = [];
                    }
                } catch (err) {
                    if (err.response && err.response.status === 400 && err.response.data.error) {
                        this.$error(err.response.data.error.message);
                    } else {
                        this.$error('Something went wrong. Please try again later.');
                    }
                    error = true;
                }
            }

            // If both requests are successful, changed is set to false.
            if (!error) {
                this.changed = false;
            }
            this.loading = false;
        },
    },
};
</script>
