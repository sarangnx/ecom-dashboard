<template>
    <footer class="footer bg-transparent px-4">
        <div class="row">
            <div class="col-12 mb-3 text-center text-lg-left">
                <router-link to="/" class="text-sm mr-4 font-weight-bold text-gray">
                    Home
                </router-link>
                <router-link to="/terms" class="text-sm font-weight-bold text-gray">
                    Terms
                </router-link>
            </div>
            <div class="col-12">
                <div class="copyright text-center text-lg-left text-muted">
                    © {{ year }}
                    <a href="https://www.doitnow.co.in" class="font-weight-bold ml-1" target="_blank">
                        doITnow Technologies
                    </a>
                </div>
            </div>
        </div>
    </footer>
</template>
<script>
export default {
    data: () => ({
        year: new Date().getFullYear(),
    }),
};
</script>
