<template>
    <li class="category-node">
        <base-button v-if="hasChildren" size="sm" class="p-1" @click.native="toggleOpen">
            <font-awesome-icon :icon="caret" fixed-width />
        </base-button>
        <base-button v-else size="sm" class="p-1" disabled type="secondary">
            <font-awesome-icon :icon="['far', 'circle']" fixed-width />
        </base-button>
        <base-button
            :type="category.bgColor ? null : category.type || 'primary'"
            :bg-color="category.bgColor || null"
            :text-color="category.textColor || null"
            size="sm"
            @click="$emit('select-category', category)"
        >
            {{ category.categoryName }}
        </base-button>
        <ul v-if="category.subCategory && category.subCategory.length && open">
            <category-node
                v-for="(subCategory, index) in category.subCategory"
                :key="index"
                :category="subCategory"
                @select-category="$emit('select-category', $event)"
            />
        </ul>
    </li>
</template>

<script>
export default {
    name: 'CategoryNode',
    props: {
        category: {
            type: Object,
            default: () => {},
        },
    },
    data: () => ({
        open: false,
    }),
    computed: {
        hasChildren() {
            return this.category && this.category.subCategory && this.category.subCategory.length;
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
