<template>
    <div class="main-content">
        <nav class="navbar navbar-top">
            <div class="container-fluid">
                <div class="col-6">
                    <router-link class="navbar-brand" to="/">
                        <img src="/img/logo-rect.webp" class="navbar-brand-img" alt="Evide.com" />
                    </router-link>
                </div>
                <div class="col text-right d-none d-md-block">
                    <h4 class="text-black text-uppercase m-0">
                        {{ $route.name }}
                    </h4>
                </div>
            </div>
        </nav>
        <div style="min-height: 100%;" class="d-flex flex-column">
            <router-view class="flex-grow-1"></router-view>
            <content-footer center></content-footer>
        </div>
    </div>
</template>
<script>
import ContentFooter from './ContentFooter.vue';

export default {
    components: {
        ContentFooter,
    },
};
</script>
<style lang="scss" scoped>
.navbar-brand img {
    max-height: 50px;
}
</style>
