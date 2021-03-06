<template>
    <table class="table tablesorter" :class="tableClass">
        <thead :class="[theadClasses, 'disable-user-select']">
            <tr>
                <slot name="columns" :columns="columns">
                    <th v-for="column in columns" :key="column">{{ column }}</th>
                </slot>
            </tr>
        </thead>
        <zoom-x-transition group tag="tbody" :class="tbodyClasses">
            <tr v-for="(item, index) in data" :key="index">
                <slot :row="item" :index="index">
                    <td v-for="(column, index2) in colsWithValue(item)" :key="index2">
                        {{ itemValue(item, column) }}
                    </td>
                </slot>
            </tr>
        </zoom-x-transition>
        <caption v-if="($slots.caption || showCaption) && (!data || (data && !data.length))">
            <slot name="caption">
                <div class="text-center">
                    <span class="text-sm">No Data</span>
                </div>
            </slot>
        </caption>
    </table>
</template>
<script>
import { ZoomXTransition } from 'vue2-transitions';

export default {
    name: 'BaseTable',
    components: {
        ZoomXTransition,
    },
    props: {
        columns: {
            type: Array,
            default: () => [],
            description: 'Table columns',
        },
        data: {
            type: Array,
            default: () => [],
            description: 'Table data',
        },
        type: {
            type: String, // striped | hover
            default: '',
            description: 'Whether table is striped or hover type',
        },
        theadClasses: {
            type: String,
            default: '',
            description: '<thead> css classes',
        },
        tbodyClasses: {
            type: String,
            default: '',
            description: '<tbody> css classes',
        },
        showCaption: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        tableClass() {
            return this.type && `table-${this.type}`;
        },
        colsWithValue() {
            return (row) => {
                return this.columns.filter((column) => this.hasValue(row, column));
            };
        },
    },
    methods: {
        hasValue(item, column) {
            return item[column] !== undefined || item[column.toLowerCase()] !== 'undefined';
        },
        itemValue(item, column) {
            return item[column] || item[column.toLowerCase()];
        },
    },
};
</script>
