<template>
    <div class="category-tree">
        <ul>
            <template v-for="(item, index) in items">
                <category-node
                    :key="index"
                    :item="item"
                    @add-category="$emit('add-category', $event)"
                    @edit-category="$emit('edit-category', $event)"
                    @delete-category="$emit('delete-category', $event)"
                />
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
        items: {
            type: Array,
            default: () => [],
        },
    },
};
</script>
<style lang="scss">
.category-tree {
    ul.category-list {
        padding-left: 20px;
    }
}
</style>
