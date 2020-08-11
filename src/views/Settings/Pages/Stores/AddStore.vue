<template>
    <div class="row">
        <div class="col-12">
            <h4>Store Name</h4>
            <base-input v-model="store.name" :error="$v.store.name.$error ? 'Store Name Required' : null" />
        </div>
        <div class="col-5 mb-3">
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
        <div class="col-7 mb-3">
            <h4>Delivery Method</h4>
            <base-checkbox v-model="store.deliveryAvailable">Home Delivery Available</base-checkbox>
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
        <div class="col-6 mb-3">
            <h4>Package</h4>
            <base-dropdown>
                    <base-button slot="title" type="primary" size="sm" class="dropdown-toggle">
                        {{ pkg.name!=undefined?pkg.name:"Select Package" }}
                    </base-button>
                    <a v-for="(item, index) in packages" :key="index" class="dropdown-item" @click="pkg = item">
                        {{ item.name }}
                    </a>
                </base-dropdown>
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
            <base-button type="success" icon="plus" block @click.prevent.stop="payNow()">Add Store</base-button>
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
        order:{},
        packages:[],
        pkg:{},
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
        let paymentScript = document.createElement('script')
        paymentScript.setAttribute('src','https://checkout.razorpay.com/v1/checkout.js')
        document.head.appendChild(paymentScript)
        this.getPackages();
        this.storeType = this.storeTypes[0];
    },
    methods: {
        async getPackages() {
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: '/packages/list',
                });

                const packages = response.data.packages;
                this.packages = packages.rows;
                this.pack = this.packages[0];
            } catch (err) {
                const res = err.response;
                if (res && res.status >= 400 && res.status < 500 && res.data.error) {
                    this.$error(res.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }
        },
        add:async function() {
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
    
            try{
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
                console.log(err);
                if (err.response && err.response.status === 400 && err.response.data.error) {
                    this.$error(err.response.data.error.message);
                } else {
                        
                    this.$error('Something went wrong. Please try again later.');
                }
            }

            this.loading = false;
        },
        verifyPayment:async function(res) {

            try{
                const data = Object.assign({}, res);
                console.log(res);
                data.razorpay_payment_id = res.razorpay_payment_id;
                data.razorpay_order_id = res.razorpay_order_id;
                data.razorpay_signature = res.razorpay_signature;
                const response = await this.$axios({
                    method: 'post',
                    url: '/stores/verify/payment',
                    data,
                });
                
                if (response.status === 200 && response.data && response.data==true) {
                    return true
                }else{
                    return false;
                }
            } catch (err) {
                return false;
            }
        },
        payNow:async function(){
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

            if(this.pkg==undefined||this.pkg==''){
                this.$error('Please select a valid package');
            }

           
            data.amount = this.pkg.price;
            data.packageId = this.pkg.packageId;

            const response = await this.$axios({
                method: 'post',
                url: '/stores/pay',
                data,
            });

            if (response.status === 200 && response.data) {
                try {
                   console.log(response.data.id);
                    const rzp_options = {
                        key: "rzp_test_0j0sb5cTJ0o805",
                        amount: this.pkg.price * 100,
                        name: this.pkg.name,
                        description: this.pkg.name,
                        order_id:response.data.id,
                        handler: async (response)=> {
                            if(await this.verifyPayment(response)){
                                this.add();
                            }else{
                                alert("Payment Failed");
                                this.$emit('done');
                            }
                            
                        },
                        modal: {
                            ondismiss: function() {
                                alert(`Payment Failed`)
                            }
                        },
                        notes: {
                            item: this.pkg.name,
                        },
                        theme: {
                            color: "#667eea"
                        }
                    };
                    const rzp1 = new Razorpay(rzp_options);
                    rzp1.open();
                } catch (err) {

                    if (err.response && err.response.status === 400 && err.response.data.error) {
                        this.$error(err.response.data.error.message);
                    } else {
                        
                        this.$error('Something went wrong. Please try again later.');
                    }
                }
            }
            

            this.loading = false;
        },
        
    },
};
</script>
