<template>
    <div class="category-tree">
        <ul v-show="items && items.length" class="col-12">
            <fade-transition group>
                <template v-for="(item, index) in items">
                    <category-node
                        :key="index"
                        :item="item"
                        @add-category="$emit('add-category', $event)"
                        @edit-category="$emit('edit-category', $event)"
                        @delete-category="$emit('delete-category', $event)"
                    />
                </template>
            </fade-transition>
        </ul>
        <div class="col-12">
            <base-button size="sm" icon="plus" type="primary" @click="$emit('add-category', null)">
                Add Category
            </base-button>
        </div>
    </div>
</template>
<script>
import { FadeTransition } from 'vue2-transitions';
import CategoryNode from './CategoryNode';

export default {
    name: 'CategoryTree',
    components: {
        CategoryNode,
        FadeTransition,
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
