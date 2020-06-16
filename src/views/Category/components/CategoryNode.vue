<template>
    <li class="category-node">
        <base-button v-if="hasChildren" size="sm" class="p-1" @click.native="toggleOpen">
            <font-awesome-icon :icon="caret" fixed-width />
        </base-button>
        <base-button v-else size="sm" class="p-1" disabled type="secondary">
            <font-awesome-icon :icon="['far', 'circle']" fixed-width />
        </base-button>
        <base-button
            :type="item.bgColor ? null : item.type || 'primary'"
            :bg-color="item.bgColor || null"
            :text-color="item.textColor || null"
            size="sm"
            @click.native="$emit('menu:open', $event, item.categoryId)"
        >
            {{ item.categoryName }}
        </base-button>
        <ul v-if="item.subCategory && item.subCategory.length && open">
            <category-node
                v-for="(category, index) in item.subCategory"
                :key="index"
                :item="category"
                @add-category="$emit('add-category', $event)"
                @menu:open="relay"
            />
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
        relay(event, data) {
            this.$emit('menu:open', event, data);
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
