<template>
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
                    @click="newPincodes.push(pincode)"
                >
                    {{ pincode.pincode }} - {{ pincode.officeName }}
                </a>
            </base-dropdown>
        </div>
        <div class="col-12 mt-3 d-flex flex-wrap">
            <badge
                v-for="(pincode, index) in selectedPincodes"
                :key="index"
                class="m-2 text-wrap d-flex align-items-center"
            >
                <span class="px-2 text-capitalize font-weight-normal">
                    <strong>{{ pincode.pincode }}</strong> - {{ pincode.officeName }}
                </span>
                <base-button icon="times" size="sm" />
            </badge>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ServiceableLocations',
    props: {
        store: {
            type: Object,
            default: () => {},
        },
        pincodes: {
            type: Array,
            default: () => [],
        },
    },
    data: () => ({
        storePincodes: [],
        newPincodes: [],
        filter: null,
        filteredPincodes: [],
    }),
    computed: {
        selectedPincodes() {
            return this.storePincodes.concat(this.newPincodes);
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
    mounted() {
        if (this.store && this.store.storeId) {
            this.getStorePincodes();
        }
        this.filteredPincodes = Object.assign({}, this.pincodes);
    },
    methods: {
        async getStorePincodes() {
            const response = await this.$axios({
                method: 'get',
                url: '/pincode/list',
                params: {
                    storeId: this.store.storeId,
                },
            });

            const pincodes = response.data.pincodes;
            this.storePincodes = pincodes.rows;
        },
    },
};
</script>
