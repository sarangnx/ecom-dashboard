<template>
    <li>
        <div>
            {{ item.categoryName }}
        </div>
        <ul v-if="item.subCategory && item.subCategory.length">
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
};
</script>
