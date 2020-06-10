<template>
    <div clas="row">
        <div class="col-12">
            <base-table :data="items">
                <template slot="columns">
                    <th>Item Name</th>
                    <th>Quantity</th>
                </template>
                <template slot-scope="{ row }">
                    <td>
                        {{ row.item && row.item.itemDetails && row.item.itemDetails.itemName }}
                    </td>
                    <td>
                        {{ parseFloat(row.quantity) }}
                        <span class="text-uppercase font-weight-bold">{{ row.unit }}</span>
                    </td>
                </template>
            </base-table>
        </div>
    </div>
</template>
<script>
export default {
    name: 'OrdersList',
    props: {
        items: {
            type: [Array],
        },
    },
    mounted() {
        console.log(this.items);
    },
};
</script>
