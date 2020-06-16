<template>
    <div class="category-tree">
        <ul>
            <template v-for="(item, index) in items">
                <category-node
                    :key="index"
                    :item="item"
                    @add-category="$emit('add-category', $event)"
                    @menu:open="openMenu"
                />
            </template>
        </ul>
        <context-menu
            :menu-items="menuItems"
            :event="contextmenu"
            :show="menu"
            @menu:close="closeMenu"
            @menu="handleMenu"
        />
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
    data: () => ({
        menuItems: [
            {
                name: 'Add Subcategory',
                type: 'success',
                handler() {
                    this.$emit('add-category', this.categoryId);
                },
            },
            {
                name: 'Edit',
                type: 'warning',
                handler() {
                    this.$emit('edit-category', this.categoryId);
                },
            },
            {
                name: 'Delete',
                type: 'danger',
                handler() {
                    this.$emit('delete-category', this.categoryId);
                },
            },
        ],
        contextmenu: {},
        menu: false,
        categoryId: null,
    }),
    methods: {
        openMenu(event, data) {
            this.menu = true;
            this.contextmenu = event;
            this.categoryId = data;
        },
        closeMenu() {
            this.menu = false;
        },
        handleMenu(value) {
            const menuItem = this.menuItems.find((item) => {
                return item.name === value;
            });
            menuItem.handler.apply(this);
        },
    },
};
</script>

<style lang="scss">
.category-tree {
    ul {
        padding-left: 20px;
    }
}
</style>
