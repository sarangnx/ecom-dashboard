<template>
    <div class="container-fluid pt-8">
        <div class="row justify-content-center">
            <div class="col-12 col-lg-8 col-xl-6">
                <div class="card shadow-lg">
                    <div class="card-body">
                        <div class="d-flex flex-column disable-user-select">
                            <div
                                class="col-12 d-flex flex-column justify-content-center align-items-center"
                                style="font-family: monospace;"
                            >
                                <div class="d-flex flex-column py-5">
                                    <span class="font-weight-bold text-lg text-danger">
                                        <span class="text-default">&lt;</span> error
                                        <span class="text-primary">code</span>
                                        <span class="text-default">=</span>"<span class="text-primary">404</span>"
                                        <span class="text-default">&gt;</span>
                                    </span>
                                    <span class="text-default text-lg ml-4">Page Not Found</span>
                                    <small class="text-muted text-sm ml-4">
                                        The page you requested could not be found.
                                    </small>
                                    <span class="font-weight-bold text-lg text-danger">
                                        <span class="text-default">&lt;</span> error
                                        <span class="text-default">/&gt;</span>
                                    </span>
                                </div>
                            </div>
                            <div class="col-12 d-flex justify-content-center">
                                <base-button type="primary" class="text-uppercase" icon="home">
                                    Go Back Home
                                </base-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
