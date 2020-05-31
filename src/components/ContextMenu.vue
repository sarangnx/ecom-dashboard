<template>
    <card v-if="show" class="context-menu" header-classes="p-3" body-classes="py-1 px-1" :style="style">
        <template v-if="header" slot="header">
            {{ header }}
        </template>
        <div>
            <div v-for="item in menuItems" :key="item.name" class="col-12 py-1 px-0">
                <base-button
                    size="sm"
                    block
                    :type="item.bgColor ? null : item.type || 'primary'"
                    :bg-color="item.bgColor || null"
                    :text-color="item.textColor || null"
                    :icon="item.icon"
                    @click="select(item.name)"
                >
                    {{ item.name }}
                </base-button>
            </div>
        </div>
    </card>
</template>
<script>
export default {
    name: 'ContextMenu',
    props: {
        menuItems: {
            type: Array,
            default: () => [],
        },
        header: {
            type: String,
            default: null,
        },
        show: {
            type: Boolean,
            default: true,
        },
        event: {
            type: [Object, MouseEvent],
            default: () => {},
        },
    },
    computed: {
        style() {
            const x = this.event.clientX || 0;
            const y = this.event.clientY || 0;
            return { left: `${x}px`, top: `${y}px` };
        },
    },
    methods: {
        select(name) {
            this.$emit('menu', name);
            this.$emit('menu:close');
        },
    },
};
</script>
<style lang="scss">
.context-menu {
    position: fixed;
    z-index: 1000;
    box-shadow: 0px 0px 10px -2px black;
}
</style>
