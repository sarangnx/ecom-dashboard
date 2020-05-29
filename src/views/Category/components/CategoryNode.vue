<template>
    <li class="category-node">
        <base-button type="primary" size="sm" @click="toggleOpen">
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
            default: () => [],
        },
    },
    data: () => ({
        open: false,
    }),
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
