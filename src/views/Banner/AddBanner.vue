<template>
    <div class="row">
        <div class="col-12">
            <h5>Banner Title</h5>
            <base-input v-model="banner.name" placeholder="Banner Title" />
        </div>
        <div class="col-12">
            <div v-show="banner.image" class="image-container">
                <img ref="image" src="#" class="col-6" />
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
            <div v-show="!banner.image" class="input-group">
                <div class="custom-file">
                    <input
                        ref="file"
                        type="file"
                        class="custom-file-input"
                        accept="image/*"
                        @change="loadImageFile($event)"
                    />
                    <label ref="label" class="custom-file-label">Banner Image</label>
                </div>
            </div>
        </div>
        <div class="col-12 mt-3">
            <base-button block type="success" icon="upload" @click="upload">Add Banner</base-button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AddBanner',
    props: {
        bannerType: {
            type: String,
            default: 'main',
        },
    },
    data: () => ({
        banner: {
            image: null,
        },
    }),
    methods: {
        removeImage() {
            // remove selected image from buffer and data property of vue.
            // and set label to default.
            this.banner.image = null;
            this.$refs.file.value = this.$refs.file.defaultValue;
            this.$refs.label.innerHTML = 'Banner Image';
        },
        loadImageFile(event) {
            this.banner.image = event.target.files[0];
            if (event.target.files[0]) {
                let reader = new FileReader();

                reader.onload = (e) => {
                    this.$refs.image.setAttribute('src', e.target.result);
                };

                reader.readAsDataURL(event.target.files[0]);
            }
        },
        openImage() {
            // open the file selector.
            this.$refs.file.click();
        },
        async upload() {
            let data = {
                bannerType: this.bannerType,
                name: this.banner.name,
                image: this.banner.image,
            };

            // remove keys with null or undefined
            for (let key in data) {
                if (!data[key]) delete data[key];
            }

            // Wrap it as FormData.
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });

            try {
                const response = await this.$axios({
                    method: 'post',
                    url: '/banners',
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
    },
};
</script>
<style scoped>
.height {
    height: 100%;
}
.image-overlay {
    cursor: pointer;
}
.image-container {
    display: flex;
    justify-content: center;
}
.image-container .image-overlay {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
    display: none;
    color: white;
}
.image-container:hover .image-overlay {
    display: block;
    background: rgba(0, 0, 0, 0.4);
}
</style>
