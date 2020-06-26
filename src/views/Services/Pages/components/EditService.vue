<template>
    <div>
        <div class="row">
            <div class="col-12">
                <h5>Service Name</h5>
                <base-input
                    v-model="serviceModel.name"
                    maxlength="200"
                    :error="$v.serviceModel.name.$error ? 'Service Name Required' : null"
                ></base-input>
            </div>
            <div class="col-12">
                <h5>Description</h5>
                <textarea
                    v-model="serviceModel.description"
                    class="form-control"
                    rows="3"
                    style="resize: none;"
                ></textarea>
            </div>
            <div class="col-12 mt-3">
                <h5>Thumbnail</h5>
                <div class="row">
                    <input ref="file" type="file" class="hidden" accept="image/*" @change="loadImageFile($event)" />
                    <div class="col-12">
                        <div v-show="serviceModel.image" class="image-container">
                            <img ref="image" :src="src" class="col-6" />
                            <!-- Overlay -->
                            <div class="image-overlay col-6">
                                <div class="d-flex justify-content-center align-items-center height">
                                    <base-button type="success" icon="camera" @click="openImage()">
                                        <small>Change</small>
                                    </base-button>
                                    <base-button type="danger" icon="trash" @click.prevent="removeImage()" />
                                </div>
                            </div>
                        </div>
                        <div v-show="!serviceModel.image" class="input-group">
                            <div class="custom-file">
                                <input
                                    ref="file"
                                    type="file"
                                    class="custom-file-input"
                                    accept="image/*"
                                    @change="loadImageFile($event)"
                                />
                                <label ref="label" class="custom-file-label">Thumbnail</label>
                            </div>
                        </div>
                        <modal :show.sync="imageModal" body-classes="pt-0" :click-out="false">
                            <h4 slot="header" class="modal-title">Crop Image</h4>
                            <vue-cropper
                                ref="cropper"
                                :aspect-ratio="1 / 1"
                                :view-mode="2"
                                drag-mode="move"
                                :container-style="{ 'max-height': '350px' }"
                            ></vue-cropper>
                            <div class="mt-2 d-flex justify-content-between">
                                <base-button type="danger" size="sm" @click="cancelCrop()">
                                    Cancel
                                </base-button>
                                <base-button icon="crop" type="success" size="sm" @click="crop()">
                                    Crop & Select
                                </base-button>
                            </div>
                        </modal>
                    </div>
                </div>
            </div>
            <div class="col-12 mt-3">
                <base-button block icon="plus" @click="addService">Add Service</base-button>
            </div>
        </div>
        <div v-if="loading" class="over__lay">
            <loading color="dark" />
        </div>
    </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
    components: {
        VueCropper,
    },
    props: {
        service: {
            type: Object,
            default: () => {},
        },
    },
    data: () => ({
        loading: false,
        serviceModel: {
            image: null,
        },
        imageModal: null,
        image: null,
    }),
    computed: {
        s3bucket() {
            return process.env.VUE_APP_S3_BUCKET;
        },
        src() {
            return this.serviceModel && this.serviceModel.image ? `${this.s3bucket}/${this.serviceModel.image}` : '#';
        },
    },
    validations: {
        serviceModel: {
            name: {
                required,
            },
        },
    },
    mounted() {
        if (this.service) {
            this.serviceModel = Object.assign({}, this.service);
        }
    },
    methods: {
        async addService() {
            this.$v.$touch();

            if (this.$v.$invalid) return;
            this.loading = true;

            let data = Object.assign({}, this.service);

            // Wrap it as FormData.
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });

            try {
                const response = await this.$axios({
                    method: 'post',
                    url: '/services/service',
                    headers: { 'Content-Type': 'multipart/form-data' },
                    data: formData,
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                }
                this.$emit('done');
            } catch (err) {
                if (err.response && err.response.status === 400 && err.response.data.error) {
                    this.$error(err.response.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }
        },
        removeImage() {
            // remove selected image from buffer and data property of vue.
            // and set label to default.
            this.service.image = null;
            this.image = null;
            this.$refs.file.value = this.$refs.file.defaultValue;
        },
        cancelCrop() {
            this.image = null;
            this.$refs.file.value = this.$refs.file.defaultValue;
            this.imageModal = false;
        },
        crop() {
            this.service.image = this.$refs.cropper.getCroppedCanvas().toDataURL();
            this.$refs.image.setAttribute('src', this.service.image);
            this.imageModal = false;
        },
        loadImageFile(event) {
            this.image = event.target.files[0];
            this.imageModal = true;
            if (event.target.files[0]) {
                let reader = new FileReader();

                reader.onload = (e) => {
                    if (this.$refs.cropper) {
                        this.$refs.cropper.replace(e.target.result);
                    }
                };

                reader.readAsDataURL(event.target.files[0]);
            }
        },
        openImage() {
            // open the file selector.
            this.$refs.file.click();
        },
    },
};
</script>
