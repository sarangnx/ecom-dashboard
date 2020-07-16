<template>
    <div class="container-fluid pt-8">
        <div class="row justify-content-center">
            <div class="col-10 col-lg-8 col-xl-6">
                <div class="card shadow-lg">
                    <div class="card-header border-0">
                        <h2 class="text-center">Terms & Conditions</h2>
                    </div>
                    <div class="card-body">
                        <terms-text />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TermsText from './TermsText';
export default {
    components: { TermsText },
};
</script>
