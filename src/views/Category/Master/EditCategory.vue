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
                >
                    None
                </a>
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
        <div class="col-12 mb-3">
            <div class="row">
                <input ref="file" type="file" class="hidden" accept="image/*" @change="loadImageFile($event)" />
                <div class="col-12">
                    <div v-show="currentCategory.image" class="image-container">
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
                    <div v-show="!currentCategory.image" class="input-group">
                        <div class="custom-file">
                            <input
                                ref="file"
                                type="file"
                                class="custom-file-input"
                                accept="image/*"
                                @change="loadImageFile($event)"
                            />
                            <label ref="label" class="custom-file-label">Category Thumbnail</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12">
            <base-button type="success" icon="upload" block @click.prevent.stop="upload()">
                Save Changes
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
    computed: {
        computedCurrentCategory() {
            return Object.assign({}, this.currentCategory);
        },
    },
    watch: {
        filter() {
            this.filteredCategories = this.categories.filter((item) => {
                const regex = new RegExp(`${this.filter}`, 'i');
                return regex.test(item.categoryName);
            });
        },
        computedCurrentCategory: {
            deep: true,
            handler(newVal, oldVal) {
                if (Object.keys(oldVal).length === 0) return;
                if (newVal.categoryName !== oldVal.categoryName) {
                    this.currentCategory.changed = true;
                }
            },
        },
    },
    mounted() {
        this.parent = this.categories.find((category) => {
            return category.categoryId === this.category.parentCategoryId;
        });
        this.filteredCategories = Object.assign({}, this.categories);
        this.currentCategory = Object.assign({}, this.category);
        if (this.currentCategory.image) {
            this.$refs.image.setAttribute(
                'src',
                `${process.env.VUE_APP_SERVER_URL}/images/categories/${this.currentCategory.image}`
            );
        }
    },
    methods: {
        removeImage() {
            // remove selected image from buffer and data property of vue.
            // and set label to default.
            this.currentCategory.image = null;
            this.$refs.file.value = this.$refs.file.defaultValue;
            this.$refs.label.innerHTML = 'Category Thumbnail';
            this.currentCategory.changed = true;
            this.currentCategory.imageChanged = true;
        },
        loadImageFile(event) {
            this.currentCategory.changed = true;
            this.currentCategory.imageChanged = true;
            if (!this.currentCategory) this.currentCategory = {};
            this.currentCategory.image = event.target.files[0];
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
            this.$v.$touch();

            if (this.$v.$invalid) return;

            if (!this.currentCategory.changed && ((this.parent && !this.parent.changed) || !this.parent)) {
                // abort if nothing's changed
                this.$warn('No changes were made!');
                return;
            }

            let data = {
                categoryId: this.currentCategory.categoryId,
            };

            if (this.currentCategory.changed) {
                data = Object.assign(data, {
                    categoryName: this.currentCategory.categoryName,
                });
            }

            if (this.currentCategory.imageChanged) {
                // if image is changed, set it to string 'null'
                // so that it is not removed before sending to server
                data = Object.assign(data, {
                    image: this.currentCategory.image || 'null',
                });
            }

            if (this.parent && this.parent.changed) {
                // if parent is set to none, set parentCategoryId to string 'null'
                data = Object.assign(data, {
                    parentCategoryId: this.parent.categoryId || 'null',
                });
            }

            this.loading = true;

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
                    method: 'patch',
                    url: '/category/master',
                    headers: { 'Content-Type': 'multipart/form-data' },
                    data: formData,
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                }
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
<style scoped>
.hidden {
    display: none;
}
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
