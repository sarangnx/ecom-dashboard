<template>
    <div>
        <div class="row">
            <div class="col-12">
                <h5>Package Name</h5>
                <base-input
                    v-model="$v.packModel.name.$model"
                    maxlength="200"
                    :error="$v.packModel.name.$error ? 'Package Name Required' : null"
                ></base-input>
            </div>
            <div class="col-6">
                <h5>Product Count</h5>
                <base-input
                    v-model="$v.packModel.count.$model"
                    type="number"
                    :error="$v.packModel.count.$error ? 'Product Count Required' : null"
                ></base-input>
            </div>
            <div class="col-6">
                <h5>Duration (in Days)</h5>
                <base-input
                    v-model="$v.packModel.duration.$model"
                    type="number"
                    :error="$v.packModel.duration.$error ? 'Package Duration Required' : null"
                ></base-input>
            </div>
            <div class="col-12">
                <h5>Price</h5>
                <base-input
                    v-model="$v.packModel.price.$model"
                    type="number"
                    :error="$v.packModel.price.$error ? 'Package Price Required' : null"
                ></base-input>
            </div>
            <div class="col-12 mt-3">
                <base-button block icon="save" type="success" @click="savePackage">Save</base-button>
            </div>
        </div>
        <div v-if="loading" class="over__lay">
            <loading color="dark" />
        </div>
    </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';

export default {
    props: {
        pack: {
            type: Object,
            default: () => {},
        },
    },
    data: () => ({
        loading: false,
        packModel: {
            name: null,
            count: null,
            duration: null,
            price: null,
        },
    }),
    validations: {
        packModel: {
            name: { required },
            count: { required },
            duration: { required },
            price: { required },
        },
    },
    mounted() {
        if (this.pack) {
            this.packModel = Object.assign({}, this.pack);
        }
    },
    methods: {
        async savePackage() {
            this.$v.$touch();

            if (this.$v.$invalid) return;
            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'post',
                    url: '/packages/package',
                    data: this.pack,
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
        },
    },
};
</script>
