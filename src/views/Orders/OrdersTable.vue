<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between flex-column flex-md-row align-items-center">
            <h3>Orders</h3>
        </div>
        <div class="card-body d-flex flex-row justify-content-around flex-wrap">
            <div v-for="(order, index) in orders" :key="index" class="card shadow h-100 col-md-5 mb-3 p-4">
                <badge :type="badgeType(order.orderStatus)">
                    {{ badgeText(order.orderStatus) }}
                </badge>
                <div class="d-flex text-muted">
                    <h4 class="m-0 pr-2 text-muted">Order Date</h4>
                    <small>{{ formatDate(order.orderDate) }}</small>
                </div>
                <div class="d-flex align-items-center">
                    <h4 class="m-0 pr-2">Name</h4>
                    <span v-if="order.user && order.user.firstName">
                        {{ order.user.firstName }}
                    </span>
                    <small v-else class="text-muted">Not Provided</small>
                </div>
                <div class="d-flex flex-column">
                    <h4 class="m-0 pr-2">Address</h4>
                    <div v-if="order.deliveryAddress" class="d-flex flex-column">
                        <span v-if="order.deliveryAddress.house">
                            <small class="text-muted font-weight-bold">House:</small>
                            {{ order.deliveryAddress.house }},
                        </span>
                        <span v-if="order.deliveryAddress.area">
                            <small class="text-muted font-weight-bold">Area:</small>
                            {{ order.deliveryAddress.area }},
                        </span>
                        <span v-if="order.deliveryAddress.city">
                            <small class="text-muted font-weight-bold">City:</small>
                            {{ order.deliveryAddress.city }},
                        </span>
                        <span v-if="order.deliveryAddress.landmark">
                            <small class="text-muted font-weight-bold">Landmark:</small>
                            {{ order.deliveryAddress.landmark }}
                        </span>
                        <span v-if="order.deliveryAddress.district">
                            <small class="text-muted font-weight-bold">District:</small>
                            {{ order.deliveryAddress.district }}
                        </span>
                        <span v-if="order.deliveryAddress.pincode">
                            <small class="text-muted font-weight-bold">Pincode:</small>
                            {{ order.deliveryAddress.pincode }}
                        </span>
                    </div>
                    <div v-else class="d-flex flex-column">
                        <small class="text-muted">Not Provided</small>
                    </div>
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
        statusColors: {
            PENDING: 'primary',
            PROCESSING: 'secondary',
            READY: 'info',
            OUTFORDELIVERY: 'warning',
            DELIVERED: 'success',
            CANCELLED: 'danger',
        },
        statusText: {
            PENDING: 'Pending',
            PROCESSING: 'Processing',
            READY: 'Ready',
            OUTFORDELIVERY: 'Out for Delivery',
            DELIVERED: 'Delivered',
            CANCELLED: 'Cancelled',
        },
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
            console.log(this.orders);
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
        badgeType(status) {
            status = status.toUpperCase();
            return this.statusColors[status];
        },
        badgeText(status) {
            status = status.toUpperCase();
            return this.statusText[status];
        },
    },
};
</script>
