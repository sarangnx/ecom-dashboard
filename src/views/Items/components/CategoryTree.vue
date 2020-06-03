<template>
    <div class="category-tree">
        <ul>
            <li class="category-node">
                <base-button size="sm" type="success" @click="$emit('select-category', category)">
                    All Categories
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
    },
    data: () => ({
        category: {
            categoryName: 'All Categories',
        },
    }),
};
</script>

<style lang="scss">
.category-tree {
    ul {
        padding-left: 30px;
    }
}
</style>
