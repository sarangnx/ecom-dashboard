<template>
    <li class="nav-item drop__down">
        <a class="nav-link" @click="toggleDropDown">
            <font-awesome-icon :icon="icon" class="mr-2" :class="classes"></font-awesome-icon>
            <span>{{ title }}</span>
        </a>
        <collapse-transition>
            <ul v-show="isOpen" class="dropdown___menu">
                <router-link
                    v-for="child in children"
                    :key="child.name"
                    :to="child.path"
                    class="nav-link dropdown___item"
                    :target="child.target"
                    :href="child.path"
                    exact-active-class="active"
                    @click.native="linkClick"
                >
                    <template>
                        <span class="nav-link-text">{{ child.name }}</span>
                    </template>
                </router-link>
            </ul>
        </collapse-transition>
    </li>
</template>
<script>
import { CollapseTransition } from 'vue2-transitions';

export default {
    name: 'SidebarDropdown',
    components: {
        CollapseTransition,
    },
    props: {
        icon: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: '',
        },
        children: {
            type: Array,
            default: () => [],
        },
        classes: {
            type: String,
            default: '',
        },
    },
    inject: {
        autoClose: {
            default: true,
        },
    },
    data: () => ({
        isOpen: false,
    }),
    methods: {
        linkClick() {
            if (this.autoClose && this.$sidebar && this.$sidebar.showSidebar === true) {
                this.$sidebar.displaySidebar(false);
            }
        },
        toggleDropDown() {
            this.isOpen = !this.isOpen;
            this.$emit('change', this.isOpen);
        },
        closeDropDown() {
            this.isOpen = false;
            this.$emit('change', this.isOpen);
        },
    },
};
</script>
<style scoped>
.drop__down {
    cursor: pointer;
    user-select: none;
}
.dropdown___menu {
    list-style-type: none;
    margin-left: 1.5rem;
    margin-right: 1.5rem;
    padding: 0px;
}
.dropdown___item {
    border-radius: 10px;
}
</style>
