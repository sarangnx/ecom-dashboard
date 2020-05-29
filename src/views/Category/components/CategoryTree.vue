<template>
    <div class="category-tree">
        <ul>
            <template v-for="(item, index) in items">
                <category-node :key="index" :item="item" @add-category="$emit('add-category', $event)" />
            </template>
            <li class="category-node">
                <base-button
                    size="sm"
                    :class="'ml-3'"
                    bg-color="#000"
                    text-color="#fff"
                    title="Add Category"
                    @click="$emit('add-category', null)"
                >
                    <font-awesome-icon icon="plus" />
                </base-button>
            </li>
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
        items: {
            type: Array,
            default: () => [],
        },
    },
};
</script>

<style lang="scss">
.category-tree {
    ul {
        padding-left: 20px;
    }
}
</style>
