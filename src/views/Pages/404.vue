<template>
    <div class="container-fluid pt-8">
        <div class="row justify-content-center">
            <div class="col-12 col-lg-8 col-xl-6">
                <div class="card shadow-lg">
                    <div class="card-body">
                        <div class="d-flex disable-user-select">
                            <img src="/img/human.svg" class="col-6 disable-user-select" />
                            <div
                                class="col-6 d-flex flex-column justify-content-center align-items-center"
                                style="font-family: monospace;"
                            >
                                <div class="d-flex flex-column">
                                    <span class="font-weight-bold text-danger">&lt;error code="404"&gt;</span>
                                    <span class="text-default ml-4">Page Not Found</span>
                                    <small class="text-muted ml-4">
                                        Page you were looking for, does not exist.
                                    </small>
                                    <span class="font-weight-bold text-danger">&lt;error/&gt;</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
