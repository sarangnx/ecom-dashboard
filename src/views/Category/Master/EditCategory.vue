<template>
    <div class="row">
        <div class="col-12 mb-4 d-flex justify-content-start align-items-center">
            <strong class="pr-2">Parent Category:</strong>
            <base-dropdown class="flex-grow-1" menu-classes="col-12">
                <base-button slot="title" type="primary" class="dropdown-toggle" block>
                    {{ parent && parent.categoryId ? parent.categoryName : 'None' }}
                </base-button>
                <template slot="search">
                    <base-input
                        id="search"
                        v-model="filter"
                        autocomplete="off"
                        class="dropdown-item"
                        placeholder="Search"
                    />
                </template>
                <a
                    class="dropdown-item"
                    @click="
                        parent = {};
                        parent.changed = true;
                    "
                    >None</a
                >
                <a
                    v-for="item in filteredCategories"
                    :key="item.categoryId"
                    class="dropdown-item"
                    @click="
                        parent = item;
                        parent.changed = true;
                    "
                >
                    {{ item.categoryName }}
                </a>
            </base-dropdown>
        </div>
        <div class="col-12">
            <base-input
                v-model="currentCategory.categoryName"
                placeholder="Category Name"
                :error="$v.currentCategory.categoryName.$error ? 'Category Name Required' : null"
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
                <div v-if="currentCategory.image" class="input-group-append">
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
        category: {
            type: Object,
            default: () => {},
        },
        categories: {
            type: Array,
            default: () => [],
        },
    },
    data: () => ({
        categoryName: null,
        image: null,
        loading: null,
        currentCategory: {},
        parent: null,
        filter: null,
        filteredCategories: [],
    }),
    validations: {
        currentCategory: {
            categoryName: {
                required,
            },
        },
    },
    watch: {
        filter() {
            this.filteredCategories = this.categories.filter((item) => {
                const regex = new RegExp(`${this.filter}`, 'i');
                return regex.test(item.categoryName);
            });
        },
        currentCategory() {
            this.currentCategory.changed = true;
        },
    },
    mounted() {
        this.parent = this.categories.find((category) => {
            return category.categoryId === this.category.parentCategoryId;
        });
        this.filteredCategories = Object.assign({}, this.categories);
        this.currentCategory = Object.assign({}, this.category);
    },
    methods: {
        loadImage(event) {
            if (!this.currentCategory) this.currentCategory = {};
            this.currentCategory.image = event.target.files[0];
            this.$refs.image.innerHTML = event.target.files[0] ? event.target.files[0].name : 'Category Thumbnail';
        },
        removeImage() {
            // remove selected image from buffer and data property of vue.
            // and set label to default.
            this.currentCategory.image = null;
            this.$refs.file.value = this.$refs.file.defaultValue;
            this.$refs.image.innerHTML = 'Category Thumbnail';
        },
        async upload() {
            this.$v.$touch();
            console.log(this.parent);
            if (this.$v.$invalid) return;
            return;
            this.loading = true;

            const data = {
                categoryName: this.categoryName,
                image: this.image,
                parentCategoryId: this.parent && this.parent.categoryId,
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
                    url: '/category/master',
                    headers: { 'Content-Type': 'multipart/form-data' },
                    data: formData,
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                }

                // reset form
                this.categoryName = null;
                this.removeImage();
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
