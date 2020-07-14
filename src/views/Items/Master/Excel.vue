<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between">
            <h3>Add Items From Excel</h3>
        </div>
        <div class="card-body px-0 position-relative min__height">
            <div v-if="!excel || !excel.length" class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <h2 class="text-black-50">Instructions</h2>
                        <h4>To add multiple Items, prepare an Excel sheet, and upload it.</h4>
                        <p class="description mb-0">
                            Be sure to follow the below format while creating Excel Sheet. The column headings are case
                            sensitive.
                        </p>
                        <p class="description">
                            Alternatively, you can
                            <a href="#" class="font-weight-bold" @click.prevent="downloadTemplate">Download Template</a>
                            and edit it.
                        </p>
                        <div class="mb-3 table-responsive">
                            <table class="table table-dark">
                                <thead>
                                    <tr>
                                        <th class="text-white" style="text-transform: none;">itemName</th>
                                        <th class="text-white" style="text-transform: none;">baseQuantity</th>
                                        <th class="text-white" style="text-transform: none;">baseUnit</th>
                                        <th class="text-white" style="text-transform: none;">categoryName</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    </div>
                    <div class="col-12">
                        <h2 class="text-black-50">Upload Excel File</h2>
                        <div class="form-group">
                            <div class="input-group">
                                <div class="custom-file">
                                    <input
                                        type="file"
                                        class="custom-file-input"
                                        accept=".xls, .xlsx, .ods"
                                        @change="handleExcel"
                                    />
                                    <label class="custom-file-label">
                                        Select an EXCEL file:
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="excel && excel.length">
                <div class="row">
                    <div class="col-12 mb-3 text-center">
                        <base-button type="success" size="sm" icon="upload" @click="uploadAll">Upload All</base-button>
                        <base-button type="danger" size="sm" icon="trash" @click="resetTable">Clear Table</base-button>
                    </div>
                    <div class="col-12">
                        <div class="table-responsive custom__scrollbar">
                            <base-table
                                class="table align-items-center table-flush"
                                thead-classes="thead-dark"
                                tbody-classes="list"
                                :data="excel"
                            >
                                <template slot="columns">
                                    <th class="text-center text-white">Product Name</th>
                                    <th class="text-center text-white">Quantity</th>
                                    <th class="text-center text-white">Unit</th>
                                    <th class="text-center text-white">Category</th>
                                    <th class="text-center text-white">Actions</th>
                                </template>
                                <template slot-scope="{ row }">
                                    <td>
                                        <base-input v-model="row.itemName" class="m-0"></base-input>
                                    </td>
                                    <td>
                                        <base-input v-model="row.baseQuantity" class="m-0"></base-input>
                                    </td>
                                    <td>
                                        <base-dropdown class="nav-item w-100" position="right">
                                            <base-button slot="title" block type="secondary" size="sm">
                                                {{ row.baseUnit && units[row.baseUnit] ? units[row.baseUnit] : 'None' }}
                                            </base-button>
                                            <a
                                                v-for="(value, key) in units"
                                                :key="key"
                                                class="dropdown-item"
                                                @click="row.baseUnit = key"
                                            >
                                                {{ value }}
                                            </a>
                                        </base-dropdown>
                                    </td>
                                    <td>
                                        <base-input v-model="row.categoryName" class="m-0"> </base-input>
                                    </td>
                                    <td>
                                        <div class="d-flex justify-content-center">
                                            <base-button
                                                type="success"
                                                icon="upload"
                                                size="sm"
                                                :loading="uploading && uploading.includes(row)"
                                                :disabled="uploading && uploading.includes(row)"
                                                @click.prevent="uploadSingle(row)"
                                            ></base-button>
                                            <base-button
                                                v-if="uploading && !uploading.includes(row)"
                                                type="danger"
                                                icon="times"
                                                size="sm"
                                                @click.prevent="removeRow(row)"
                                            ></base-button>
                                        </div>
                                    </td>
                                </template>
                            </base-table>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="loading" class="over__lay">
                <loading color="dark" />
            </div>
        </div>
    </div>
</template>
<script>
import XLSX from 'xlsx';

export default {
    name: 'Excel',
    data: () => ({
        excel: [],
        loading: false,
        uploading: [],
        units: {
            kg: 'Kilogram',
            g: 'Gram',
            l: 'Litre',
            ml: 'Millilitre',
            m: 'Metre',
            u: 'Unit',
            p: 'Plate',
        },
    }),
    methods: {
        resetTable() {
            this.excel = [];
        },
        handleExcel(file) {
            this.loading = true;

            const excel = file.target.files[0];

            const reader = new FileReader();
            reader.onload = (file) => {
                const data = new Uint8Array(file.target.result);
                // Load the excel book as an array
                const workbook = XLSX.read(data, { type: 'array' });
                // Name of first sheet.
                const sheetName = workbook.SheetNames[0];
                // get data from sheet 1.
                const sheet = workbook.Sheets[sheetName];
                // convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                /***
                 * First Line ( row ) is considered as the header row.
                 * Everything else is data.
                 */
                this.excel = jsonData;
                this.loading = false;
            };

            reader.readAsArrayBuffer(excel);
        },
        downloadTemplate() {
            // Sheet headers
            const sheet = XLSX.utils.aoa_to_sheet([['itemName', 'baseQuantity', 'baseUnit', 'categoryName']]);

            // create workbook and append sheet
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, sheet, 'default');

            // download the workbook
            XLSX.writeFile(workbook, 'template.xls');
        },
        removeRow(item) {
            const index = this.excel.indexOf(item);
            if (index > -1) this.excel.splice(index, 1);
        },
        async uploadSingle(item) {
            this.uploading.push(item);

            try {
                const response = await this.$axios({
                    method: 'post',
                    url: '/inventory/master',
                    data: item,
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                }
                // remove the row after uploading
                this.removeRow(item);
            } catch (err) {
                if (err.response && err.response.status === 400 && err.response.data.error) {
                    this.$error(err.response.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }

            // fallback for when upload is not successful.
            const index = this.uploading.indexOf(item);
            if (index > -1) this.uploading.splice(index, 1);
        },
        async uploadAll() {
            this.loading = true;

            try {
                const response = await this.$axios({
                    method: 'post',
                    url: '/inventory/multiple',
                    data: this.excel,
                });

                if (response.status === 200 && response.data.message) {
                    this.$success(response.data.message);
                }
            } catch (err) {
                if (err.response && err.response.status === 400 && err.response.data.error) {
                    this.$error(err.response.data.error.message);
                } else {
                    this.$error('Something went wrong. Please try again later.');
                }
            }

            this.loading = false;
        },
    },
};
</script>
