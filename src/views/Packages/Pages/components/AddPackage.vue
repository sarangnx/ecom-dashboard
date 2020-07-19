<template>
    <div>
        <div class="row">
            <div class="col-12">
                <h5>Package Name</h5>
                <base-input
                    v-model="$v.pack.name.$model"
                    maxlength="200"
                    :error="$v.pack.name.$error ? 'Package Name Required' : null"
                ></base-input>
            </div>
            <div class="col-6">
                <h5>Product Count</h5>
                <base-input
                    v-model="$v.pack.count.$model"
                    type="number"
                    :error="$v.pack.count.$error ? 'Product Count Required' : null"
                ></base-input>
            </div>
            <div class="col-6">
                <h5>Duration (in Days)</h5>
                <base-input
                    v-model="$v.pack.duration.$model"
                    type="number"
                    :error="$v.pack.duration.$error ? 'Package Duration Required' : null"
                ></base-input>
            </div>
            <div class="col-12">
                <h5>Price</h5>
                <base-input
                    v-model="$v.pack.price.$model"
                    type="number"
                    :error="$v.pack.price.$error ? 'Package Price Required' : null"
                ></base-input>
            </div>
            <div class="col-12 mt-3">
                <base-button block icon="plus" @click="addPackage">Add Package</base-button>
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
    data: () => ({
        loading: false,
        pack: {
            name: null,
            count: null,
            duration: null,
            price: null,
        },
    }),
    validations: {
        pack: {
            name: { required },
            count: { required },
            duration: { required },
            price: { required },
        },
    },
    methods: {
        async addPackage() {
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
