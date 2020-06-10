<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between flex-column flex-md-row align-items-center">
            <h3>Orders</h3>
        </div>
        <div class="card-body d-flex flex-row justify-content-around flex-wrap">
            <div v-for="(order, index) in orders" :key="index" class="card shadow h-100 col-md-5 mb-3 p-4">
                <div class="d-flex text-muted">
                    <h4 class="m-0 pr-2 text-muted">Order Date</h4>
                    <span>{{ formatDate(order.orderDate) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'OrdersTable',
    props: {
        storeId: {
            type: [Number, String],
        },
    },
    data: () => ({
        orders: [],
    }),
    mounted() {
        this.getOrders();
    },
    methods: {
        async getOrders() {
            const response = await this.$axios({
                method: 'get',
                url: '/orders',
                params: {
                    storeId: this.storeId,
                },
            });

            const orders = response.data.orders;
            this.orders = orders.rows;
        },
        formatDate(date) {
            date = new Date(date);
            let dateString = date.toDateString();

            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            const timeString = hours + ':' + minutes + ' ' + ampm;
            return `${dateString} - ${timeString}`;
        },
    },
};
</script>
