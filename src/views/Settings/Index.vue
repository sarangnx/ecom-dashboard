<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8"> </base-header>
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-12">
                    <div class="card shadow">
                        <div class="card-header d-flex justify-content-between">
                            <router-link to="/settings"><h3>Settings</h3></router-link>
                        </div>
                        <div class="card-body d-flex flex-row justify-content-start flex-wrap">
                            <div class="container">
                                <router-view />
                            </div>
                        </div>
                        <div class="card-footer"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Settings',
};
</script>
