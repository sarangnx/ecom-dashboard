<template>
    <div class="form-group disable-user-select">
        <div
            :class="[
                { 'input-group': hasIcon },
                { 'has-danger': error },
                { focused: focused },
                { 'has-label': label || $slots.label },
                { 'has-success': valid === true },
                { 'has-danger': valid === false },
                classes,
            ]"
        >
            <slot name="label">
                <label v-if="label" class="form-control-label" :class="labelClasses" style="white-space: nowrap;">
                    {{ label }}
                    <span v-if="required">*</span>
                </label>
            </slot>

            <div v-if="addonLeftIcon || $slots.addonLeft" class="input-group-prepend">
                <span class="input-group-text" :class="addonLeftClass">
                    <slot name="addonLeft">
                        <font-awesome-icon v-if="addonLeftIcon" :icon="addonLeftIcon"></font-awesome-icon>
                    </slot>
                </span>
            </div>
            <slot v-bind="slotData">
                <input
                    :value="value"
                    v-bind="$attrs"
                    class="form-control"
                    :class="[{ 'is-valid': valid === true }, { 'is-invalid': error }, ...[inputClasses]]"
                    aria-describedby="addon-right addon-left"
                    v-on="listeners"
                />
            </slot>
            <div v-if="addonRightIcon || $slots.addonRight" class="input-group-append">
                <span class="input-group-text" :class="addonRightClass">
                    <slot name="addonRight">
                        <font-awesome-icon v-if="addonRightIcon" :icon="addonRightIcon"></font-awesome-icon>
                    </slot>
                </span>
            </div>
        </div>
        <slot name="infoBlock"></slot>
        <slot name="errorBlock">
            <div v-if="error" class="text-danger invalid-feedback p-1" style="display: block;">
                <small>{{ error }}</small>
            </div>
        </slot>
    </div>
</template>
<script>
export default {
    name: 'BaseInput',
    inheritAttrs: false,
    props: {
        required: {
            type: Boolean,
            description: 'Whether input is required (adds an asterix *)',
        },
        valid: {
            type: Boolean,
            description: 'Whether is valid',
            default: undefined,
        },
        label: {
            type: String,
            description: 'Input label (text before input)',
        },
        error: {
            type: String,
            description: 'Input error (below input)',
        },
        labelClasses: {
            type: String,
            description: 'Input label css classes',
        },
        inputClasses: {
            type: [String, Array],
            description: 'Input css classes',
        },
        value: {
            type: [String, Number],
            description: 'Input value',
        },
        addonRightIcon: {
            type: [String, Object],
            description: 'Addon right icon',
        },
        addonLeftIcon: {
            type: [String, Object],
            description: 'Addont left icon',
        },
        classes: {
            type: String,
        },
        addonLeftClass: {
            type: [String, Array],
        },
        addonRightClass: {
            type: [String, Array],
        },
    },
    data() {
        return {
            focused: false,
        };
    },
    computed: {
        listeners() {
            return {
                ...this.$listeners,
                input: this.updateValue,
                focus: this.onFocus,
                blur: this.onBlur,
            };
        },
        slotData() {
            return {
                focused: this.focused,
                ...this.listeners,
            };
        },
        hasIcon() {
            const { addonRight, addonLeft } = this.$slots;
            return (
                addonRight !== undefined ||
                addonLeft !== undefined ||
                this.addonRightIcon !== undefined ||
                this.addonLeftIcon !== undefined
            );
        },
    },
    methods: {
        updateValue(evt) {
            let value = evt.target.value;
            this.$emit('input', value);
        },
        onFocus(value) {
            this.focused = true;
            this.$emit('focus', value);
        },
        onBlur(value) {
            this.focused = false;
            this.$emit('blur', value);
        },
    },
};
</script>
