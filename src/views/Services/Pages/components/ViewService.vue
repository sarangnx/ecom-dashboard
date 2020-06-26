<template>
    <div class="container-fluid">
        <div class="row">
            <div v-if="service.image" class="col-12 d-flex justify-content-center mb-3">
                <img :src="`${s3bucket}/${service.image}`" style="max-height: 200px;" />
            </div>
            <div class="col-12">
                <strong class="mr-2">Service Name:</strong>
                <span>{{ service.name }}</span>
            </div>
            <div v-if="service.description" class="col-12">
                <strong>Description: </strong>
                <span>{{ service.description }}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        service: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        s3bucket() {
            return process.env.VUE_APP_S3_BUCKET;
        },
    },
};
</script>
