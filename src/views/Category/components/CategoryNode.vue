<template>
    <li class="category-node">
        <font-awesome-icon v-if="hasChildren" :icon="caret" class="mr-2" />
        <base-button
            :type="item.bgColor ? null : item.type || 'primary'"
            :bg-color="item.bgColor || null"
            :text-color="item.textColor || null"
            size="sm"
            :class="[!hasChildren && 'ml-3']"
            @click.native="toggleOpen"
            @contextmenu.native.prevent="$emit('contextmenu', $event, item.categoryId)"
        >
            {{ item.categoryName }}
        </base-button>
        <ul v-if="item.subCategory && item.subCategory.length && open">
            <category-node
                v-for="(category, index) in item.subCategory"
                :key="index"
                :item="category"
                @add-category="$emit('add-category', $event)"
                @contextmenu="relay"
            />
            <li class="category-node">
                <base-button
                    size="sm"
                    :class="'ml-3'"
                    bg-color="#000"
                    text-color="#fff"
                    title="Add Sub Category"
                    @click="$emit('add-category', item.categoryId)"
                >
                    <font-awesome-icon icon="plus" />
                </base-button>
            </li>
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
            this.$emit('contextmenu', event, data);
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
