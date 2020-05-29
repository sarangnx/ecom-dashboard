<template>
    <component
        :is="tag"
        :type="tag === 'button' ? nativeType : ''"
        class="btn"
        :class="classes"
        :disabled="disabled"
        :style="styles"
        @click="handleClick"
    >
        <span v-if="($slots.icon || (icon && $slots.default)) && !loading" class="btn-inner--icon">
            <slot name="icon">
                <font-awesome-icon :icon="icon"></font-awesome-icon>
            </slot>
        </span>
        <font-awesome-icon v-if="!$slots.default && !loading" :icon="icon"></font-awesome-icon>
        <span v-if="($slots.icon || (icon && $slots.default)) && !loading" class="btn-inner--text">
            <slot>
                {{ text }}
            </slot>
        </span>
        <slot v-if="!$slots.icon && !icon && !loading"></slot>
        <slot v-if="loading" name="loading">
            <font-awesome-icon icon="circle-notch" spin></font-awesome-icon>
        </slot>
    </component>
</template>
<script>
export default {
    name: 'BaseButton',
    props: {
        tag: {
            type: String,
            default: 'button',
            description: 'Button tag (default -> button)',
        },
        type: {
            type: String,
            default: 'default',
            description: 'Button type (e,g primary, danger etc)',
        },
        bgColor: {
            type: String,
            description: 'Hex Background color',
        },
        size: {
            type: String,
            default: '',
            description: 'Button size lg|sm',
        },
        textColorClass: {
            type: String,
            default: '',
            description: 'Button text color (e.g primary, danger etc)',
        },
        textColor: {
            type: String,
            description: 'Hex text color',
        },
        nativeType: {
            type: String,
            default: 'button',
            description: 'Button native type (e.g submit,button etc)',
        },
        icon: {
            type: String,
            default: '',
            description: 'Button icon',
        },
        text: {
            type: String,
            default: '',
            description: 'Button text in case not provided via default slot',
        },
        outline: {
            type: Boolean,
            default: false,
            description: 'Whether button style is outline',
        },
        rounded: {
            type: Boolean,
            default: false,
            description: 'Whether button style is rounded',
        },
        iconOnly: {
            type: Boolean,
            default: false,
            description: 'Whether button contains only an icon',
        },
        block: {
            type: Boolean,
            default: false,
            description: 'Whether button is of block type',
        },
        loading: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        classes() {
            let btnClasses = [
                { 'btn-block': this.block },
                { 'rounded-circle': this.rounded },
                { 'btn-icon-only': this.iconOnly },
                { [`text-${this.textColorClass}`]: this.textColorClass },
                { 'btn-icon': this.icon || this.$slots.icon },
                this.type && !this.outline ? `btn-${this.type}` : '',
                this.outline ? `btn-outline-${this.type}` : '',
            ];
            if (this.size) {
                btnClasses.push(`btn-${this.size}`);
            }
            return btnClasses;
        },
        styles() {
            let styles = [];
            if (this.bgColor) {
                styles.push({ background: this.bgColor });
            }
            if (this.textColor) {
                styles.push({ color: this.textColor });
            }
            return styles;
        },
    },
    methods: {
        handleClick(evt) {
            this.$emit('click', evt);
        },
    },
};
</script>
<style></style>
