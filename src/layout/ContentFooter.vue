<template>
    <footer class="footer bg-transparent px-4">
        <div class="row align-items-center justify-content-lg-between">
            <div class="col-lg-6">
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
