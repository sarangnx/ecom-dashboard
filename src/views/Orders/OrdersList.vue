<template>
    <div clas="row">
        <div class="col-12 p-0">
            <div class="table-responsive">
                <base-table :data="items" thead-classes="thead-dark">
                    <template slot="columns">
                        <th class="text-white">Item Name</th>
                        <th class="text-center text-white">Unit Price</th>
                        <th class="text-center text-white">Quantity</th>
                        <th class="text-center text-white">Price</th>
                    </template>
                    <template slot-scope="{ row }">
                        <td>
                            {{ row.item && row.item.itemDetails && row.item.itemDetails.itemName }}
                        </td>
                        <td class="text-center">
                            ₹ {{ row.unitPrice }} /
                            {{ row.item && row.item.itemDetails && parseFloat(row.item.itemDetails.baseQuantity) }}
                            <span class="text-uppercase font-weight-bold">
                                {{ row.item && row.item.itemDetails && row.item.itemDetails.baseUnit }}
                            </span>
                        </td>
                        <td class="text-center">
                            {{ parseFloat(row.quantity) }}
                            <span class="text-uppercase font-weight-bold">{{ row.unit }}</span>
                        </td>
                        <td class="text-center">₹ {{ parseFloat(row.price) }}</td>
                    </template>
                </base-table>
            </div>
        </div>
        <div class="col-12 text-right">
            <small class="font-weight-bold mr-2">Total Price:</small>
            <span>₹ {{ total }}</span>
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
