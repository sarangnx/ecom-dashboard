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
                <modal :show.sync="selectCategoryModal" body-classes="pt-0" :click-out="false">
                    <template slot="header">
                        <h4 class="modal-title">Select Category</h4>
                    </template>
                    <category-tree :categories="categories" none @select-category="select" />
                </modal>
            </div>
            <!-- CATEGORY -->

            <div class="col-12">
                <h5>Product Image</h5>
            </div>
            <div class="form-group col-12">
                <div class="input-group">
                    <div class="custom-file">
                        <input ref="file" type="file" class="custom-file-input" @change="loadImage($event)" />
                        <label ref="image" class="custom-file-label">Product Image</label>
                    </div>
                    <div class="input-group-append">
                        <base-button type="danger" icon="times" @click.prevent="removeImage()"> </base-button>
                    </div>
                </div>
            </div>

            <div class="form-group col">
                <base-button type="success" icon="upload" @click.prevent.stop="upload()">Add Item</base-button>
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
    methods: {
        select(category) {
            this.item.category = Object.assign({}, category);
            this.selectCategoryModal = false;
        },
    },
};
</script>
