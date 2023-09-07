<template>
    <el-table :data="bindData" border height="630px" stripe style="width: 100%">
        <el-table-column align="center" fixed prop="Account" label="Account" width='85px' />
        <el-table-column align="center" fixed prop="Ticker" label="Ticker" width='85px' />
        <el-table-column align="center" prop="TransactionDate" label="TransactionDate" width='120px' />
        <el-table-column align="center" prop="Name" label="Name" width='230px' />
        <el-table-column align="center" prop="Action" label="Action" width='110px' />
        <el-table-column align="center" prop="Total_GBP" label="Total_GBP" width='100px' />
        <el-table-column align="center" prop="NoOfShares" label="NoOfShares" width='110px' />
        <el-table-column align="center" prop="PriceShare" label="PriceShare" width='100px' />
        <el-table-column align="center" prop="Result_GBP" label="Result_GBP" width='110px' />
        <el-table-column align="center" prop="WithholdingTax" label="WithholdingTax" width='140px' />
        <el-table-column align="center" prop="ChargeAmount_GBP" label="ChargeAmount_GBP" width='170px' />
        <el-table-column align="center" prop="DepositFee_GBP" label="DepositFee_GBP" width='140px' />
        <el-table-column align="center" prop="TransactionFee_GBP" label="TransactionFee_GBP" width='170px' />
        <el-table-column align="center" prop="FinraFee_GBP" label="FinraFee_GBP" width='120px' />
        <el-table-column align="center" prop="CurrencyConversionFee_GBP" label="CurrencyConversionFee_GBP" width='230px' />
        <el-table-column align="center" prop="StampDutyReserveTax_GBP" label="StampDutyReserveTax_GBP" width='220px' />
    </el-table>
</template>
  
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useBasicdataStore } from '../store/BasicData.ts'
import StockDto from '../model/StockDto'

const BasicData = useBasicdataStore();

/**
 * Binding data for tables:From data sharing library
 */
const bindData = ref(new Array<StockDto>)

/**
 * Refresh the current view when monitoring shared data changes
 */
BasicData.$subscribe(() => {
    bindData.value = BasicData.filterStr.length > 0 && BasicData.viewType === "period" ? BasicData.filterData : BasicData.getCurrDateStocks;
})

onMounted(() => {
    bindData.value = BasicData.filterStr.length > 0 && BasicData.viewType === "period" ? BasicData.filterData : BasicData.getCurrDateStocks;
});
</script>

<style scoped></style>