<template>
    <component
        :is="tag"
        v-click-outside="closeDropDown"
        class="dropdown disable-user-select"
        :class="[{ show: isOpen }, { dropdown: direction === 'down' }, { dropup: direction === 'up' }]"
        aria-haspopup="true"
        :aria-expanded="isOpen"
        @click="toggleDropDown"
    >
        <slot name="title">
            <a class="dropdown-toggle nav-link" :class="{ 'no-caret': hideArrow }" data-toggle="dropdown">
                <i :class="icon"></i>
                <span class="no-icon">{{ title }}</span>
            </a>
        </slot>
        <collapse-transition>
            <ul
                v-show="isOpen"
                ref="menu"
                class="dropdown-menu drop__down show"
                :class="[{ 'dropdown-menu-right': position === 'right' }, menuClasses]"
            >
                <slot name="search"></slot>
                <slot></slot>
            </ul>
        </collapse-transition>
    </component>
</template>
<script>
import { CollapseTransition } from 'vue2-transitions';

export default {
    name: 'BaseDropdown',
    components: { CollapseTransition },
    props: {
        direction: {
            type: String,
            default: 'down',
        },
        title: {
            type: String,
            description: 'Dropdown title',
        },
        icon: {
            type: String,
            description: 'Icon for dropdown title',
        },
        position: {
            type: String,
            description: 'Position of dropdown menu (e.g right|left)',
        },
        menuClasses: {
            type: [String, Object],
            description: 'Dropdown menu classes',
        },
        hideArrow: {
            type: Boolean,
            description: 'Whether dropdown arrow should be hidden',
        },
        appendToBody: {
            type: Boolean,
            default: true,
            description: 'Whether dropdown should be appended to document body',
        },
        tag: {
            type: String,
            default: 'li',
            description: 'Dropdown html tag (e.g div, li etc)',
        },
    },
    data() {
        return {
            isOpen: false,
        };
    },
    methods: {
        toggleDropDown(event) {
            // If element inside the search slot is given id='search'
            // the dropdown will not close on click
            if (event.target && event.target.id === 'search') {
                return;
            }
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
<style>
.dropdown {
    list-style-type: none;
}

.dropdown .dropdown-toggle {
    cursor: pointer;
}
</style>
