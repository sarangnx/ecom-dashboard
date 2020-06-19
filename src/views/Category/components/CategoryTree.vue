<template>
    <div class="category-tree">
        <ul v-if="items && items.length" class="col-12">
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
        <div class="col-12">
            <base-button size="sm" icon="plus" type="primary" @click="$emit('add-category', null)">
                Add Category
            </base-button>
        </div>
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
<style lang="scss" scoped>
.category-tree {
    ul.category-list {
        padding-left: 20px;
    }
}
</style>
