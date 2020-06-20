<template>
    <div class="row">
        <div class="col-12 mb-3">
            <div>
                <strong>Name: </strong><span>{{ selected.itemName }}</span>
            </div>
            <div>
                <strong>Quantity: </strong>
                <span>
                    {{ parseFloat(selected.baseQuantity) }} <small>{{ selected.baseUnit | toUpper }}</small>
                </span>
            </div>
        </div>
        <div class="form-group col-12">
            <h5>Category</h5>
            <base-button class="col-12" @click="modal = true">
                {{ category.categoryName || 'None' }}
                <font-awesome-icon icon="caret-down" pull="right" />
            </base-button>
            <div v-if="$v.category.categoryId.$error" class="text-danger invalid-feedback p-1" style="display: block;">
                <small>Category Required</small>
            </div>
            <modal :show.sync="modal" body-classes="pt-0" :click-out="false">
                <template slot="header">
                    <h4 class="modal-title">Select Category</h4>
                </template>
                <category-tree :categories="categories" none @select-category="select" />
            </modal>
        </div>
        <div class="col-12">
            <h5>Price</h5>
            <base-input
                v-model="item.price"
                type="number"
                placeholder="Price of 1 unit (1Kg, 1L etc.)"
                :error="$v.item.price.$error ? 'Price Required' : null"
            ></base-input>
        </div>
        <div class="col-12">
            <base-button type="success" icon="plus" block @click.prevent.stop="add()">Add Item</base-button>
        </div>
        <div v-if="loading" class="over__lay">
            <loading color="dark" />
        </div>
    </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import CategoryTree from '../components/CategoryTree';

export default {
    name: 'AddModal',
    components: {
        CategoryTree,
    },
    filters: {
        toUpper(string) {
            if (!string) return;
            return string.toUpperCase();
        },
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
        storeId: {
            type: [Number, String],
        },
    },
    data: () => ({
        item: {},
        category: {},
        modal: null,
        loading: null,
    }),
    validations: {
        category: {
            categoryId: {
                required,
            },
        },
        item: {
            price: {
                required,
            },
        },
    },
    mounted() {
        if (this.selected) {
            this.item = Object.assign({}, { itemId: this.selected.itemId });
        }
    },
    methods: {
        select(category) {
            this.category = Object.assign({}, category);
            this.modal = false;
        },
        async add() {
            this.$v.$touch();
            if (this.$v.$invalid) return;

            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'post',
                    url: '/inventory/store',
                    data: {
                        ...this.item,
                        categoryId: this.category && this.category.categoryId,
                        storeId: this.storeId,
                    },
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

            this.loading = false;
        },
    },
};
</script>
