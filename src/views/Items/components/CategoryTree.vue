<template>
    <div class="category-tree">
        <ul>
            <li class="category-node">
                <base-button size="sm" type="success" @click="$emit('select-category', category)">
                    {{ category.categoryName }}
                </base-button>
            </li>
            <template v-for="(category, index) in categories">
                <category-node :key="index" :category="category" @select-category="$emit('select-category', $event)" />
            </template>
        </ul>
    </div>
</template>

<script>
import CategoryNode from './CategoryNode';

export default {
    name: 'CategoryTree',
    components: {
        CategoryNode,
    },
    props: {
        categories: {
            type: Array,
            default: () => [],
        },
        none: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        category: {
            categoryName: 'All Categories',
        },
    }),
    mounted() {
        if (this.none) this.category.categoryName = 'None';
    },
};
</script>

<style lang="scss" scoped>
.category-tree {
    ul {
        padding-left: 30px;
    }
}
</style>
