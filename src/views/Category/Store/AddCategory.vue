<template>
    <div class="row">
        <div class="col-12">
            <span v-if="parent"><strong>Parent:</strong> {{ parent.categoryName }}</span>
            <span v-else><strong>Parent:</strong> None</span>
        </div>
        <div class="col-12">
            <base-input
                v-model="categoryName"
                placeholder="Category Name"
                :error="$v.categoryName.$error ? 'Category Name Required' : null"
            />
        </div>
        <div class="form-group col-12">
            <div class="input-group">
                <div class="custom-file">
                    <input
                        ref="file"
                        type="file"
                        class="custom-file-input"
                        accept="image/*"
                        @change="loadImage($event)"
                    />
                    <label ref="image" class="custom-file-label">Category Thumbnail</label>
                </div>
                <div v-if="image" class="input-group-append">
                    <base-button type="danger" icon="trash" @click.prevent="removeImage()" />
                </div>
            </div>
        </div>
        <div class="col-12">
            <base-button type="success" icon="upload" block @click.prevent.stop="upload()">
                Add Category
            </base-button>
        </div>
        <div v-if="loading" class="over__lay">
            <loading color="dark" />
        </div>
    </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';

export default {
    name: 'AddCategory',
    props: {
        parent: {
            type: Object,
            default: () => {},
        },
        storeId: {
            type: [Number, String],
        },
    },
    data: () => ({
        categoryName: null,
        image: null,
        loading: null,
    }),
    validations: {
        categoryName: {
            required,
        },
    },
    methods: {
        loadImage(event) {
            this.image = event.target.files[0];
            this.$refs.image.innerHTML = event.target.files[0] ? event.target.files[0].name : 'Category Thumbnail';
        },
        removeImage() {
            // remove selected image from buffer and data property of vue.
            // and set label to default.
            this.image = null;
            this.$refs.file.value = this.$refs.file.defaultValue;
            this.$refs.image.innerHTML = 'Category Thumbnail';
        },
        async upload() {
            this.$v.$touch();
            if (this.$v.$invalid) return;

            this.loading = true;

            const data = {
                categoryName: this.categoryName,
                image: this.image,
                parentCategoryId: this.parent && this.parent.categoryId,
                storeId: this.storeId,
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
                    url: '/category/store',
                    headers: { 'Content-Type': 'multipart/form-data' },
                    data: formData,
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                }

                // reset form
                this.categoryName = null;
                this.removeImage();
                this.$emit('done');
            } catch (err) {
                if (err.response && err.response.status === 400 && err.response.data.error) {
                    this.$error(err.response.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            } finally {
                this.$v.$reset();
                this.loading = false;
            }
        },
    },
};
</script>
