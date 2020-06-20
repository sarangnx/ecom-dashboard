<template>
    <div class="row">
        <div class="col-12">
            <h4>Store Name</h4>
            <base-input v-model="store.name" :error="$v.store.name.$error ? 'Store Name Required' : null" />
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
            <base-input v-model="store.area" :error="$v.store.area.$error ? 'Area Required' : null" />
        </div>
        <div class="col-6">
            <h5 class="text-muted">City</h5>
            <base-input v-model="store.city" :error="$v.store.city.$error ? 'City Required' : null" />
        </div>
        <div class="col-6">
            <h5 class="text-muted">District</h5>
            <base-input v-model="store.district" :error="$v.store.district.$error ? 'District Required' : null" />
        </div>
        <div class="col-6">
            <h5 class="text-muted">State</h5>
            <base-input v-model="store.state" :error="$v.store.state.$error ? 'State Required' : null" />
        </div>
        <div class="col-6">
            <h5 class="text-muted">Pincode</h5>
            <base-input
                v-model="store.pincode"
                type="number"
                :error="$v.store.pincode.$error ? 'Pincode Required' : null"
            />
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
        </div>
        <div class="col-12">
            <base-button type="success" icon="plus" block @click.prevent.stop="add()">Add Store</base-button>
        </div>
        <div v-if="loading" class="over__lay">
            <loading color="dark" />
        </div>
    </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';

export default {
    name: 'AddModal',
    props: {
        userId: {
            type: [Number, String],
        },
    },
    data: () => ({
        store: {},
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
    mounted() {
        this.storeType = this.storeTypes[0];
    },
    methods: {
        async add() {
            this.$v.$touch();

            if (this.$v.$invalid) return;

            // prepare data
            const data = Object.assign({}, this.store);
            data.userId = this.userId;

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
                    method: 'post',
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
