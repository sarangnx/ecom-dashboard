<template>
    <div class="category-dropdown">
        <base-button size="sm" @click="modal = true">
            {{ selected.categoryName }}
            <font-awesome-icon icon="caret-down" class="ml-2" />
        </base-button>
        <modal :show.sync="modal" header-classes="d-flex align-items-center pb-0" :click-out="false" scrollable>
            <template slot="header">
                <h3 class="modal-title">Select Category</h3>
            </template>
            <category-tree :categories="categories" @select-category="select" />
        </modal>
    </div>
</template>

<script>
import CategoryTree from './CategoryTree';
export default {
    name: 'CategoryDropdown',
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
        selected: {
            categoryName: 'All Categories',
        },
        modal: null,
    }),
    methods: {
        select(category) {
            this.selected = category;
            this.modal = false;
            this.$emit('category-id', category.categoryId);
        },
    },
};
</script>
