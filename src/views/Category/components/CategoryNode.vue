<template>
    <li class="category-node">
        <font-awesome-icon v-if="hasChildren" :icon="caret" class="mr-2" />
        <base-button type="primary" size="sm" :class="[!hasChildren && 'ml-3']" @click="toggleOpen">
            {{ item.categoryName }}
        </base-button>
        <ul v-if="item.subCategory && item.subCategory.length && open">
            <category-node v-for="(category, index) in item.subCategory" :key="index" :item="category" />
        </ul>
    </li>
</template>

<script>
export default {
    name: 'CategoryNode',
    props: {
        item: {
            type: Object,
            default: () => {},
        },
    },
    data: () => ({
        open: false,
    }),
    computed: {
        hasChildren() {
            return this.item && this.item.subCategory && this.item.subCategory.length;
        },
        caret() {
            return this.open ? 'caret-down' : 'caret-right';
        },
    },
    methods: {
        toggleOpen() {
            this.open = !this.open;
        },
    },
};
</script>

<style lang="scss">
.category-node {
    list-style: none;
    padding: 5px;
}
</style>
