<template>
    <div clas="row">
        <div class="col-12 p-0">
            <base-table :data="items" thead-classes="thead-dark">
                <template slot="columns">
                    <th>Item Name</th>
                    <th class="text-center">Quantity</th>
                    <th class="text-center">Price</th>
                </template>
                <template slot-scope="{ row }">
                    <td>
                        {{ row.item && row.item.itemDetails && row.item.itemDetails.itemName }}
                    </td>
                    <td class="text-center">
                        {{ parseFloat(row.quantity) }}
                        <span class="text-uppercase font-weight-bold">{{ row.unit }}</span>
                    </td>
                    <td class="text-center">
                        {{ parseFloat(row.price) }}
                    </td>
                </template>
            </base-table>
        </div>
        <div class="col-12 text-right">
            <small class="font-weight-bold mr-2">Total Price:</small>
            <span>{{ total }}</span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'OrdersList',
    props: {
        items: {
            type: Array,
        },
        total: {
            type: [String, Number],
        },
    },
};
</script>
