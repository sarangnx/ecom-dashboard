<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between flex-column flex-md-row align-items-center">
            <h3>Orders</h3>
            <!-- FILTER BY STATUS -->
            <base-dropdown position="right">
                <base-button slot="title" size="sm" :type="badgeType(status)">
                    {{ badgeText(status) }}
                    <font-awesome-icon icon="caret-down" />
                </base-button>
                <a class="dropdown-item pointer text-dark" @click="status = null">
                    All
                </a>
                <a
                    v-for="(value, key) of statusText"
                    :key="key"
                    class="dropdown-item pointer"
                    :class="[`text-${badgeType(key)}`]"
                    @click="status = key"
                >
                    {{ value }}
                </a>
            </base-dropdown>
        </div>
        <div class="card-body d-flex flex-row justify-content-around flex-wrap position-relative min__height">
            <template v-if="orders && orders.length">
                <div v-for="(order, index) in orders" :key="index" class="card shadow h-100 col-md-5 mb-3">
                    <div class="card-body">
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
                    <div class="card-footer py-2">
                        <base-dropdown>
                            <base-button
                                slot="title"
                                size="sm"
                                :type="badgeType(order.orderStatus)"
                                :loading="statusLoading == order.orderId"
                            >
                                {{ badgeText(order.orderStatus) }}
                                <font-awesome-icon icon="caret-down" />
                            </base-button>
                            <a
                                v-for="(value, key) of statusText"
                                :key="key"
                                class="dropdown-item pointer"
                                :class="[`text-${badgeType(key)}`]"
                                @click="!statusLoading && changeStatus(order.orderId, key, index)"
                            >
                                {{ value }}
                            </a>
                        </base-dropdown>
                        <base-button
                            size="sm"
                            @click="
                                modal = true;
                                isText = order.isText;
                                orderItems = order.orderItems;
                                orderFile = order.orderFile;
                            "
                            >View Order</base-button
                        >
                    </div>
                </div>
            </template>
            <div
                v-if="!(orders && orders.length) && !loading"
                class="col-12 p-5 d-flex justify-content-center align-items-center"
            >
                <small class="p-2">no orders</small>
                <font-awesome-icon icon="shopping-basket" />
            </div>
            <div v-if="loading" class="over__lay">
                <loading />
            </div>
        </div>
        <div class="card-footer">
            <base-pagination v-model="page" :page-count="totalPages" align="center" />
        </div>
        <modal :show.sync="modal" header-classes="pb-0">
            <h5 slot="header">Order Items</h5>
            <img v-if="!isText" :src="'http://localhost:4566/bucketevide/' + orderFile" />
            <div v-if="isText" class="row">
                <div class="col-md-12">
                    {{ orderItems }}
                </div>
            </div>
        </modal>
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
        page: 1,
        isText: false,
        limit: 10,
        totalPages: 1,
        status: null,
        statusColors: {
            PENDING: 'primary',
            PROCESSING: 'darker',
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
        loading: false,
        statusLoading: null,
        modal: false,
        orderFile: '',
        orderItems: '',
    }),
    watch: {
        page() {
            this.getOrders();
        },
        limit() {
            this.getOrders();
        },
        status() {
            this.page > 1 ? (this.page = 1) : this.getOrders();
        },
        storeId() {
            this.getOrders();
        },
    },
    mounted() {
        this.getOrders();
    },
    methods: {
        async getOrders() {
            this.loading = true;
            try {
                const response = await this.$axios({
                    method: 'get',
                    url: 'imageOrders',
                    params: {
                        storeId: this.storeId,
                        page: this.page,
                        limit: this.limit,
                        orderStatus: this.status,
                    },
                });

                const orders = response.data.orders;
                this.orders = orders.rows;
                this.totalPages = Math.ceil(orders.count / this.limit);
            } catch (err) {
                this.$error('Unable to get orders! Try again later.');
            }

            this.loading = false;
        },
        async changeStatus(orderId, orderStatus, index) {
            this.statusLoading = orderId;

            try {
                const response = await this.$axios({
                    method: 'patch',
                    url: 'imageOrders/status',
                    data: {
                        orderId,
                        orderStatus,
                    },
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                    this.orders[index].orderStatus = orderStatus;
                }
            } catch (err) {
                if (err.response && err.response.status === 400 && err.response.data.error) {
                    this.$error(err.response.data.error.message);
                } else {
                    this.$error('Order status was not changed! Try again.');
                }
            }

            this.statusLoading = null;
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
            if (!status) return 'dark';
            return this.statusColors[status];
        },
        badgeText(status) {
            if (!status) return 'All';
            return this.statusText[status];
        },
    },
};
</script>
