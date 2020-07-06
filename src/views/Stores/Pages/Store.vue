<template>
    <div class="card-body position-relative min__height">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <small class="font-weight-bold mr-2">Store Name:</small>
                    <span>{{ store.name }}</span>
                </div>
                <div class="col-12">
                    <small class="font-weight-bold mr-2">Store Type:</small>
                    <span>{{ storeTypes[store.storeType] }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        store: {
            type: Object,
            default: () => {},
        },
    },
    data: () => ({
        storeTypes: {
            SUPERMARKET: 'Super Market',
            GROCERY: 'Grocery',
            RESTAURANTS: 'Restaurants',
            MEDICALSHOPS: 'Medical Shops',
            VEGNFRUITS: 'Vegetables & Fruits',
            OTHERS: 'Others',
        },
    }),
    mounted() {
        console.log(this.store);
    },
};
</script>
