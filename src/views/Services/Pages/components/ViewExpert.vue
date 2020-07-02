<template>
    <div class="container p-0">
        <div v-if="expert" class="row">
            <div class="col-12">
                <strong class="mr-2">Name:</strong>
                <span>
                    {{ expert.profile && expert.profile.firstName }}
                    {{ expert.profile && expert.profile.lastName }}
                </span>
            </div>
            <div class="col-12">
                <strong class="mr-2">Contact Number:</strong>
                <span>{{ expert.contactNumber }}</span>
            </div>
            <div class="col-12">
                <strong class="mr-2">WhatsApp Number:</strong>
                <span>{{ expert.whatsappNumber }}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        expert: {
            type: Object,
            default: () => {},
        },
    },
};
</script>
