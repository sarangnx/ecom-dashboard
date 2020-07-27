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
        <div class="card-body position-relative min__height bg-secondary">
            <div :class="['row', { 'mb-3': edit }]">
                <div class="col-12">
                    <base-input
                        v-model="store.name"
                        :disabled="!edit"
                        label="Store Name"
                        :input-classes="['form-control-alternative', { 'bg-secondary shadow-none': !edit }]"
                        :classes="['d-flex', { 'flex-row align-items-baseline': !edit }, { 'flex-column': edit }]"
                        :class="[{ 'm-0': !edit }]"
                        :error="$v.store.name.$error ? 'Store Name Required' : null"
                    />
                </div>
                <div class="col-12">
                    <label class="form-control-label mr-3" style="white-space: nowrap;">Store Type</label>
                    <span v-if="!edit" class="text-gray text-sm">{{ storeTypes[store.storeType] }}</span>
                    <base-dropdown v-else>
                        <base-button slot="title" type="primary" size="sm" class="dropdown-toggle">
                            {{ storeTypes[store.storeType] }}
                        </base-button>
                        <a
                            v-for="(value, key) in storeTypes"
                            :key="key"
                            class="dropdown-item"
                            @click="store.storeType = key"
                        >
                            {{ value }}
                        </a>
                    </base-dropdown>
                </div>
            </div>
            <div class="row">
                <span class="col-12 text-muted mt-4 heading-small font-weight-bold">Store Address</span>
            </div>
            <div :class="['row', { 'mb-3': edit }]">
                <div class="col-12 col-md-6 col-lg-4">
                    <base-input
                        v-model="store.area"
                        :disabled="!edit"
                        label="Area"
                        :input-classes="['form-control-alternative', { 'bg-secondary shadow-none': !edit }]"
                        :classes="['d-flex', { 'flex-row align-items-baseline': !edit }, { 'flex-column': edit }]"
                        :class="[{ 'm-0': !edit }]"
                        :error="$v.store.area.$error ? 'Area Required' : null"
                    />
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <base-input
                        v-model="store.city"
                        :disabled="!edit"
                        label="City"
                        :input-classes="['form-control-alternative', { 'bg-secondary shadow-none': !edit }]"
                        :classes="['d-flex', { 'flex-row align-items-baseline': !edit }, { 'flex-column': edit }]"
                        :class="[{ 'm-0': !edit }]"
                        :error="$v.store.city.$error ? 'City Required' : null"
                    />
                </div>
            </div>
            <div :class="['row', { 'mb-3': edit }]">
                <div class="col-12 col-md-6 col-lg-4">
                    <base-input
                        v-model="store.district"
                        :disabled="!edit"
                        label="District"
                        :input-classes="['form-control-alternative', { 'bg-secondary shadow-none': !edit }]"
                        :classes="['d-flex', { 'flex-row align-items-baseline': !edit }, { 'flex-column': edit }]"
                        :class="[{ 'm-0': !edit }]"
                        :error="$v.store.district.$error ? 'District Required' : null"
                    />
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <base-input
                        v-model="store.state"
                        :disabled="!edit"
                        label="State"
                        :input-classes="['form-control-alternative', { 'bg-secondary shadow-none': !edit }]"
                        :classes="['d-flex', { 'flex-row align-items-baseline': !edit }, { 'flex-column': edit }]"
                        :class="[{ 'm-0': !edit }]"
                        :error="$v.store.state.$error ? 'State Required' : null"
                    />
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <base-input
                        v-model="store.pincode"
                        :disabled="!edit"
                        label="Pincode"
                        type="number"
                        :input-classes="['form-control-alternative', { 'bg-secondary shadow-none': !edit }]"
                        :classes="['d-flex', { 'flex-row align-items-baseline': !edit }, { 'flex-column': edit }]"
                        :class="[{ 'm-0': !edit }]"
                        :error="$v.store.pincode.$error ? 'Pincode Required' : null"
                    />
                </div>
            </div>
            <div class="row mt-4 mb-2">
                <span class="col-12 text-muted heading-small font-weight-bold">Phones</span>
            </div>
            <div v-if="!edit" class="row">
                <div v-for="(phone, key) in store.phones" :key="key" class="col-12">
                    <label class="form-control-label mr-3" style="white-space: nowrap;">{{ key }}</label>
                    {{ phone }}
                </div>
            </div>
            <div v-else class="d-flex flex-column">
                <div v-for="(value, index) of phones" :key="index" class="d-flex flex-row justify-content-between mb-3">
                    <base-input
                        v-model="phones[index].key"
                        placeholder="Type (like office, help etc.)"
                        :disabled="phones[index].key === 'default'"
                        class="mb-0 mr-2"
                    />
                    <base-input v-model="phones[index].value" type="number" placeholder="Phone Number" class="mb-0" />
                    <base-button
                        :disabled="phones[index].key === 'default'"
                        icon="trash"
                        type="danger"
                        class="ml-2"
                        @click="phones.splice(index, 1)"
                    />
                </div>
                <base-button
                    icon="plus"
                    type="default"
                    class="mb-3 align-self-end"
                    size="sm"
                    @click="phones.push({ key: null, value: null })"
                >
                    Add Phone
                </base-button>
            </div>
            <div class="row mt-4 mb-2">
                <span class="col-12 text-muted heading-small font-weight-bold">Other Info</span>
            </div>
            <div class="row">
                <div class="col-12">
                    <label class="form-control-label mr-3" style="white-space: nowrap;">Delivery Method</label>
                    <small v-if="!edit">
                        {{ store.deliveryAvailable ? 'Pickup + Home Delivery' : 'Pickup only' }}
                    </small>
                    <base-checkbox v-else v-model="store.deliveryAvailable">Home Delivery Available</base-checkbox>
                </div>
            </div>
            <div v-if="!edit" class="row">
                <div class="col-12">
                    <label class="form-control-label mr-3" style="white-space: nowrap;">Store Status</label>
                    <badge :type="store.blocked ? 'danger' : 'success'">
                        {{ store.blocked ? 'Blocked' : 'Active' }}
                    </badge>
                </div>
                <div class="col-12">
                    <label class="form-control-label mr-3" style="white-space: nowrap;">Verification Status</label>
                    <badge :type="store.verified ? 'success' : 'danger'">
                        {{ store.verified ? 'Verified' : 'Not Verified' }}
                    </badge>
                </div>
            </div>
            <div v-if="!edit" class="row mt-4 mb-2">
                <span class="col-12 text-muted heading-small font-weight-bold">Package</span>
            </div>
            <div v-if="!edit" class="row">
                <template v-if="store.package">
                    <div class="col-12">
                        <label class="form-control-label mr-3" style="white-space: nowrap;">Package Name</label>
                        <span class="text-gray text-sm">{{ store.package.packageDetails.name }}</span>
                    </div>
                    <div class="col-12">
                        <label class="form-control-label mr-3" style="white-space: nowrap;">Product Count</label>
                        <span class="text-gray text-sm">{{ store.package.packageDetails.count }}</span>
                    </div>
                    <div class="col-12">
                        <label class="form-control-label mr-3" style="white-space: nowrap;">Validity</label>
                        <span class="text-gray text-sm">{{ store.package.packageDetails.duration }} days</span>
                    </div>
                    <div class="col-12">
                        <label class="form-control-label mr-3" style="white-space: nowrap;">Price</label>
                        <span class="text-gray text-sm">₹{{ store.package.packageDetails.price }}</span>
                    </div>
                </template>
                <div v-else class="col-12">
                    <base-button size="sm" @click="packageModal = true">Choose a Package</base-button>
                </div>
            </div>
            <div v-if="loading" class="over__lay">
                <loading />
            </div>
        </div>
        <select-package :store-id="store.storeId" :show.sync="packageModal" @selected="getStore(storeId)" />
    </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import SelectPackage from './SelectPackage';

export default {
    components: {
        SelectPackage,
    },
    data: () => ({
        loading: false,
        edit: false,
        store: {},
        original: null,
        storeTypes: {
            SUPERMARKET: 'Supermarket',
            GROCERY: 'Grocery',
            RESTAURANTS: 'Restaurants',
            MEDICALSHOPS: 'Medical Shops',
            VEGNFRUITS: 'Vegetables & Fruits',
            OTHERS: 'Others',
        },
        packages: null,
        packageModal: false,
        phones: [],
    }),
    computed: {
        storeId() {
            return this.$route.params ? this.$route.params.storeId : null;
        },
    },
    validations: {
        store: {
            name: {
                required,
            },
            area: {
                required,
            },
            city: {
                required,
            },
            district: {
                required,
            },
            state: {
                required,
            },
            pincode: {
                required,
            },
        },
    },
    async mounted() {
        if (this.storeId) {
            await this.getStore(this.storeId);
        }
        this.splitPhones();
    },
    methods: {
        async getStore(storeId) {
            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/stores/store',
                    params: { storeId },
                });

                this.store = Object.assign({}, response.data.store);
                this.original = Object.assign({}, response.data.store);
                console.log(this.store);
            } catch (err) {
                const res = err.response;
                if (res && res.status >= 400 && res.status < 500 && res.data.error) {
                    this.$error(res.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }

            this.loading = false;
        },
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
        splitPhones() {
            // split to array
            if (this.store && this.store.phones) {
                this.phones = [];
                for (let key in this.store.phones) {
                    this.phones.push({
                        key,
                        value: this.store.phones[key],
                    });
                }
            }
        },
        close() {
            this.store = Object.assign({}, this.original);
            this.splitPhones();
            this.edit = false;
        },
        async save() {
            this.$v.$touch();

            if (this.$v.$invalid) return;
        },
    },
};
</script>
