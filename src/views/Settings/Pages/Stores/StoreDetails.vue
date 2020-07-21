<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-start align-items-center">
            <base-button size="sm" icon="arrow-left" @click="$router.push('/settings/stores')"></base-button>
            <h3 class="m-0">Store</h3>
        </div>
        <div class="card-body position-relative min__height">
            <div v-if="!loading" class="over__lay">
                <loading />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data: () => ({
        loading: false,
    }),
};
</script>
