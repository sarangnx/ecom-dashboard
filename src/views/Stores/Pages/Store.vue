<template>
    <div class="card-body p-0 position-relative min__height"></div>
</template>
<script>
export default {
    props: {
        store: {
            type: Object,
            default: () => {},
        },
    },
    mounted() {
        console.log(this.store);
    },
};
</script>
