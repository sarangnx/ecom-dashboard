<template>
    <div class="row">
        <div class="col-12">
            <h4>Store Name</h4>
            <base-input
                v-model="storeModel.name"
                placeholder="Store Name"
                :error="$v.storeModel.name.$error ? 'Store Name Required' : null"
            />
        </div>
        <div class="col-12 mb-3">
            <h4>Store Type</h4>
            <div v-if="storeType">
                <base-dropdown>
                    <base-button slot="title" type="primary" size="sm" class="dropdown-toggle">
                        {{ storeType.name }}
                    </base-button>
                    <a v-for="(item, index) in storeTypes" :key="index" class="dropdown-item" @click="storeType = item">
                        {{ item.name }}
                    </a>
                </base-dropdown>
            </div>
        </div>
        <div class="col-12">
            <h4>Store Address</h4>
            <h5 class="text-muted">Area</h5>
            <base-input v-model="storeModel.area" placeholder="Area" />
        </div>
        <div class="col-6">
            <h5 class="text-muted">City</h5>
            <base-input v-model="storeModel.city" placeholder="City" />
        </div>
        <div class="col-6">
            <h5 class="text-muted">District</h5>
            <base-input v-model="storeModel.district" placeholder="District" />
        </div>
        <div class="col-6">
            <h5 class="text-muted">State</h5>
            <base-input v-model="storeModel.state" placeholder="State" />
        </div>
        <div class="col-6">
            <h5 class="text-muted">Pincode</h5>
            <base-input v-model="storeModel.pincode" placeholder="Pincode" />
        </div>
        <div class="col-12">
            <h5 class="text-muted">Phones</h5>
            <div class="d-flex flex-column">
                <div v-for="(value, index) of phones" :key="index" class="d-flex flex-row justify-content-between mb-3">
                    <base-input
                        v-model="phones[index].key"
                        placeholder="Type (like office, help etc.)"
                        :disabled="phones[index].key === 'default'"
                        class="mb-0 mr-2"
                    />
                    <base-input v-model="phones[index].value" placeholder="Phone Number" class="mb-0" />
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
        </div>
        <div class="col-12">
            <base-button type="success" icon="save" block @click.prevent.stop="save">Save</base-button>
        </div>
        <div v-if="loading" class="over__lay">
            <loading color="dark" />
        </div>
    </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';

export default {
    name: 'EditModal',
    props: {
        store: {
            type: Object,
            default: () => {},
        },
    },
    data: () => ({
        storeModel: {},
        phones: [{ key: 'default', value: null }],
        loading: null,
        storeTypes: [
            { key: 'SUPERMARKET', name: 'Super Market' },
            { key: 'GROCERY', name: 'Grocery' },
            { key: 'RESTAURANTS', name: 'Restaurants' },
            { key: 'MEDICALSHOPS', name: 'Medical Shops' },
            { key: 'VEGNFRUITS', name: 'Vegetables & Fruits' },
            { key: 'OTHERS', name: 'Others' },
        ],
        storeType: {},
    }),
    validations: {
        storeModel: {
            name: {
                required,
            },
        },
    },
    mounted() {
        this.storeType = this.storeTypes[0];
        if (this.store) {
            this.storeModel = Object.assign({}, this.store);
        }

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

        // select store type from dropdown
        if (this.store && this.store.storeType) {
            const storeType = this.storeTypes.find((item) => {
                return item.key === this.store.storeType;
            });
            this.storeType = Object.assign({}, storeType);
        }
    },
    methods: {
        async save() {
            this.$v.$touch();

            if (this.$v.$invalid) return;

            // prepare data
            const data = Object.assign({}, this.store);

            // if multiple phone numbers are given combine them to an object
            if (this.phones && this.phones.length) {
                data.phones = this.phones.reduce((phones, phone) => {
                    if (phone.key) {
                        phones[phone.key] = phone.value;
                    }

                    return phones;
                }, {});
            }

            // Add Store Type
            if (this.storeType) {
                data.storeType = this.storeType.key;
            }

            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'patch',
                    url: '/stores/store',
                    data,
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                }

                this.$emit('done');
            } catch (err) {
                if (err.response && err.response.status === 400 && err.response.data.error) {
                    this.$error(err.response.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }

            this.loading = false;
        },
    },
};
</script>
