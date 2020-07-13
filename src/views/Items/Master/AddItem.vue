<template>
    <div>
        <div class="row">
            <div class="col-12">
                <h5>Product Name</h5>
                <base-input
                    v-model="item.itemName"
                    maxlength="200"
                    :error="$v.item.itemName.$error ? 'Item Name Required' : null"
                ></base-input>
            </div>

            <div class="col-6">
                <h5>Base Quantity</h5>
                <base-input
                    v-model="item.baseQuantity"
                    placeholder="Quantity"
                    type="number"
                    min="1"
                    :error="$v.item.baseQuantity.$error ? 'Base Quantity Required' : null"
                ></base-input>
            </div>

            <div class="col-6">
                <h5>Base Unit</h5>
                <select
                    v-model="item.baseUnit"
                    class="custom-select mr-sm-2"
                    :class="[{ 'is-invalid': $v.item.baseUnit.$error }]"
                >
                    <option value="null">None</option>
                    <option>kg</option>
                    <option>g</option>
                    <option>l</option>
                    <option>ml</option>
                    <option>count</option>
                </select>
                <div v-if="$v.item.baseUnit.$error" class="text-danger invalid-feedback" style="display: block;">
                    Unit Required
                </div>
            </div>
            <div class="col-6">
                <h5>Base Price</h5>
                <base-input v-model="item.basePrice"></base-input>
            </div>

            <!-- CATEGORY -->
            <div class="form-group col-12 col-md-6">
                <h5>Category</h5>
                <base-input v-model="item.category.categoryName" class="mr-sm-2" @focus="selectCategoryModal = true">
                </base-input>
                <modal :show.sync="selectCategoryModal" body-classes="pt-0" :click-out="false" scrollable>
                    <template slot="header">
                        <h4 class="modal-title">Select Category</h4>
                    </template>
                    <category-tree :categories="categories" none @select-category="select" />
                </modal>
            </div>
            <!-- CATEGORY -->

            <div class="col-12 mb-3">
                <h5>Product Image</h5>
                <div class="row">
                    <input ref="file" type="file" class="hidden" accept="image/*" @change="loadImageFile($event)" />
                    <div class="col-12">
                        <div v-show="item.image" class="image-container">
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
                        <div v-show="!item.image" class="input-group">
                            <div class="custom-file">
                                <input
                                    ref="file"
                                    type="file"
                                    class="custom-file-input"
                                    accept="image/*"
                                    @change="loadImageFile($event)"
                                />
                                <label ref="label" class="custom-file-label">Product Image</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-group col">
                <base-button type="success" icon="upload" block @click.prevent.stop="upload()">Add Item</base-button>
            </div>
            <div v-if="loading" class="over__lay">
                <loading color="dark" />
            </div>
        </div>
    </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import CategoryTree from '../components/CategoryTree';

export default {
    name: 'AddItem',
    components: {
        CategoryTree,
    },
    props: {
        categories: {
            type: Array,
            default: () => [],
        },
        selected: {
            type: Object,
            default: () => {},
        },
    },
    data: () => ({
        item: {
            itemName: null,
            baseQuantity: null,
            baseUnit: null,
            basePrice: null,
            image: null,
            category: {
                categoryId: null,
                categoryName: null,
            },
        },
        selectCategoryModal: false,
        loading: null,
    }),
    validations: {
        item: {
            itemName: {
                required,
            },
            baseQuantity: {
                required,
            },
            baseUnit: {
                required,
            },
        },
    },
    mounted() {
        if (this.selected && this.selected.categoryId) {
            this.item.category = Object.assign({}, this.selected);
        }
    },
    methods: {
        select(category) {
            this.item.category = Object.assign({}, category);
            this.selectCategoryModal = false;
        },
        removeImage() {
            // remove selected image from buffer and data property of vue.
            // and set label to default.
            this.item.image = null;
            this.$refs.file.value = this.$refs.file.defaultValue;
            this.$refs.label.innerHTML = 'Product Image';
        },
        loadImageFile(event) {
            this.item.image = event.target.files[0];
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

            let data = {
                itemName: this.item.itemName,
                baseQuantity: this.item.baseQuantity,
                baseUnit: this.item.baseUnit,
                basePrice: this.item.basePrice,
                image: this.item.image,
                categoryId: this.item.category.categoryId,
            };

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
                    method: 'post',
                    url: '/inventory/master',
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
            this.$v.$reset();
            this.loading = false;
        },
    },
};
</script>
