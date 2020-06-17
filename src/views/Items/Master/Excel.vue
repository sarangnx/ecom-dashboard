<template>
    <div class="card shadow">
        <div class="card-header d-flex justify-content-between">
            <h3>Add Items From Excel</h3>
        </div>
        <div class="card-body position-relative min__height">
            <div class="row">
                <div class="col-12">
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
    </div>
</template>
<script>
import XLSX from 'xlsx';

export default {
    name: 'Excel',
    data: () => ({
        excel: [],
        loading: true,
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
    },
};
</script>
