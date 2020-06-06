<template>
    <div class="row">
        <div class="col-12 mb-3">
            <div>
                <strong>Name: </strong><span>{{ item.itemName }}</span>
            </div>
            <div>
                <strong>Quantity: </strong>
                <span>
                    {{ parseFloat(item.baseQuantity) }} <small>{{ item.baseUnit | toUpper }}</small>
                </span>
            </div>
        </div>
        <div class="form-group col-12">
            <h5>Category</h5>
            <base-button class="col-12" @click="modal = true">
                {{ category.categoryName || 'None' }}
                <font-awesome-icon icon="caret-down" pull="right" />
            </base-button>
            <modal :show.sync="modal" body-classes="pt-0" :click-out="false">
                <template slot="header">
                    <h4 class="modal-title">Select Category</h4>
                </template>
                <category-tree :categories="categories" none @select-category="select" />
            </modal>
        </div>
        <div class="col-12">
            <h5>Price</h5>
            <base-input v-model="item.price" placeholder="Price of 1 unit (1Kg, 1L etc.)"></base-input>
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
    },
    data: () => ({
        item: {},
        category: {},
        modal: null,
        price: null,
        loading: null,
    }),
    mounted() {
        if (this.selected) {
            this.item = Object.assign({}, this.selected);
        }
    },
    methods: {
        select(category) {
            this.category = Object.assign({}, category);
            this.modal = false;
        },
        async add() {
            return;
            let data = {
                basePrice: this.item.basePrice,
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
