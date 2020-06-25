<template>
    <div class="position-relative">
        <div class="row">
            <div class="col-12">
                <h5>Service Name</h5>
                <base-input
                    v-model="service.name"
                    maxlength="200"
                    :error="$v.service.name.$error ? 'Service Name Required' : null"
                ></base-input>
            </div>
            <div class="col-12">
                <h5>Description</h5>
                <textarea v-model="service.description" class="form-control" rows="3" style="resize: none;"></textarea>
            </div>
            <div class="col-12 mt-3">
                <base-button block icon="plus" @click="addService">Add Service</base-button>
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
        service: {},
    }),
    validations: {
        service: {
            name: {
                required,
            },
        },
    },
    methods: {
        addService() {
            console.log(this.service);
        },
    },
};
</script>
