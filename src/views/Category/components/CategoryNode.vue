<template>
    <li class="category-node">
        <div class="p-2" @mouseover="showOption = true" @mouseout="showOption = false">
            <base-button v-if="hasChildren" size="sm" class="p-1" @click.native="toggleOpen">
                <font-awesome-icon :icon="caret" fixed-width />
            </base-button>
            <base-button v-else size="sm" class="p-1" disabled type="secondary">
                <font-awesome-icon :icon="['far', 'circle']" fixed-width />
            </base-button>
            <span class="mr-3 text-dark font-weight-bold">
                {{ item.categoryName }}
            </span>
            <base-button v-show="showOption" size="sm" type="primary">
                <font-awesome-icon icon="ellipsis-v" fixed-width />
            </base-button>
        </div>
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
        showOption: false,
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
}
</style>
