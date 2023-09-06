<template>
    <div id="Filter">
        <el-row>
            <el-col :span="7">
                <el-radio-group v-model="filterType">
                    <el-radio-button label="day">Day</el-radio-button>
                    <el-radio-button label="month">Month</el-radio-button>
                    <el-radio-button label="year">Year</el-radio-button>
                </el-radio-group>
            </el-col>
            <el-col :span="12">
                <el-date-picker v-model="period" :default-value="period" type="daterange" range-separator="To"
                    start-placeholder="Start date" end-placeholder="End date" style="margin-top: 1px;" />
            </el-col>
            <el-col :span="1">
                <el-button type="primary" @click="queryClick">
                    <el-icon style="vertical-align: middle">
                        <Search />
                    </el-icon>
                </el-button>
            </el-col>
        </el-row>
    </div>
    <div v-if="filterType === 'day'">
        <el-table height="620px" border highlight-current-row :data="tableData">
            <el-table-column v-for="col in 32" :key="col" :label="col === 1 ? 'M/D' : String(col - 1)" width="50"
                align="center" :fixed="col === 1">
                <template #default="scope">
                    <div v-if="col === 1">{{ scope.row[0] }}</div>
                    <div v-else class="chart-day" :ref="el => { if (el) initChart(el as HTMLElement, scope.row[col - 1]) }"
                        @click="DateClick(scope.row[col - 1])">
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div v-else>
        <div class="charts-container">
            <div v-for="data in tableData" class="chartmonthyear-out">
                <div class="chart-monthyear" :ref="el => { if (el) initChart(el as HTMLElement, data) }"
                    @click="DateClick(data)">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus'
import { useBasicdataStore } from '../store/BasicData.ts'
import { FormatDate_yyyyMMdd } from '../helper/DateHelper'
import StockDto from '../model/StockDto'

const BasicData = useBasicdataStore()
const period = ref([new Date("2022-01-01"), new Date("2022-12-31")]);
const filterType = ref("day")       //day,month,year
watch(filterType, () => {
    filterTypeChange();
});

const tableData = ref([]);

onMounted(() => {
    queryClick();
});

const queryClick = () => {
    if (period.value.length == 0) {
        ElMessage({
            type: 'warning',
            message: 'Warning:Please select a date range!',
        });
        return;
    }
    BasicData.viewType = "period";
    BasicData.filterStr = "";
    BasicData.startDay = FormatDate_yyyyMMdd(period.value[0]);
    BasicData.endDay = FormatDate_yyyyMMdd(period.value[1]);
    tableData.value = getTableData();
}

const getMonthDesc = (month: any) => {
    if (month === 1) return "Jan"
    else if (month === 2) return "Feb"
    else if (month === 3) return "Mar"
    else if (month === 4) return "Apr"
    else if (month === 5) return "May"
    else if (month === 6) return "Jun"
    else if (month === 7) return "Jul"
    else if (month === 8) return "Aug"
    else if (month === 9) return "Sep"
    else if (month === 10) return "Oct"
    else if (month === 11) return "Nov"
    else if (month === 12) return "Dec"
    else return "NaN"
}

const getTableData = () => {
    if (filterType.value === "day") {
        return DataDroupByDay();
    }
    else if (filterType.value === "month") {
        return DataDroupByMonth();
    }
    else {
        return DataDroupByYear();
    }
}

//根据时间段内的数据按照月分组
const DataDroupByDay = () => {
    const stockData = BasicData.getCurrDateStocks
    const bindData: any = []
    for (const stock of stockData) {
        let date = new Date(stock.TransactionDate as string)
        const month = date.getMonth() + 1
        const day = date.getDate()
        if (!bindData[month]) {
            bindData[month] = { 0: getMonthDesc(month) }
        }
        if (!bindData[month][day]) {
            bindData[month][day] = [];
        }
        bindData[month][day].push(stock)
    }
    return bindData
}

const DataDroupByMonth = () => {
    const stockData = BasicData.getCurrDateStocks
    const groupedData = stockData.reduce((key, value) => {
        const groupKey = new Date(value.TransactionDate as string).getMonth()
        if (!key[groupKey]) {
            key[groupKey] = [];
        }

        key[groupKey].push(value);
        return key;
    }, {} as Record<string, typeof stockData>);
    return Object.entries(groupedData).sort((a, b) => Number(a[0]) - Number(b[0])).map(entry => entry[1])
}

const DataDroupByYear = () => {
    const stockData = BasicData.getCurrDateStocks
    const groupedData = stockData.reduce((key, value) => {
        const groupKey = (value.TransactionDate as string).slice(0, 4)
        if (!key[groupKey]) {
            key[groupKey] = [];
        }

        key[groupKey].push(value);
        return key;
    }, {} as Record<string, typeof stockData>);
    return groupedData
}

const initChart = (el: HTMLElement, pieData: any) => {
    nextTick(() => {
        let myChart: echarts.ECharts;

        //避免重复创建echarts实例
        if (echarts.getInstanceByDom(el)) {
            myChart = echarts.getInstanceByDom(el) as echarts.ECharts;
        } else {
            myChart = echarts.init(el);
        }

        //只绘制单元格有数据的饼图
        if (!pieData) {
            myChart.clear()
            return;
        }
        const tickerGroup = BasicData.getGroupByTicker(pieData)
        var data = []
        for (const key in tickerGroup) {
            var value = tickerGroup[key].reduce((total: number, currentItem: StockDto) => total + currentItem.Total_GBP, 0);
            data.push({
                name: key,
                value: Number(value.toFixed(2)),
            })
        }

        const option = {
            title: {

            },
            series: [
                {
                    type: 'pie',
                    label: {
                        show: false
                    },
                    data: data
                }
            ]
        };
        if (filterType.value === "month") {
            option.title = {
                text: getMonthDesc((new Date(pieData[0].TransactionDate)).getMonth() + 1),
                left: 'center',
                // show: true
            }
        }
        else if (filterType.value === 'year') {
            option.title = {
                text: pieData[0].TransactionDate.slice(0, 4),
                left: 'center',
                // show: true
            }
        }
        myChart.setOption(option);
    })

}

//日历表格的点击事件
const DateClick = (stockData: StockDto[]) => {
    if (!stockData) {
        BasicData.filterData = []
        BasicData.filterStr = " "
        return;
    }
    BasicData.filterData = stockData
    if (filterType.value == "day") {
        BasicData.filterStr = (stockData[0].TransactionDate as string).slice(5)
    }
    else if (filterType.value == "month") {
        BasicData.filterStr = getMonthDesc((new Date(stockData[0].TransactionDate as string)).getMonth() + 1)
    }
    else if (filterType.value == "year") {
        BasicData.filterStr = (stockData[0].TransactionDate as string).slice(0, 4)
    }
    else {
        BasicData.filterStr = ""
    }
}

const filterTypeChange = () => {
    tableData.value = getTableData()
}

</script>

<style>
#Filter {
    margin-top: 10px;
    margin-bottom: 10px;
}

.chart-day {
    width: 50px;
    height: 50px;
    margin: 0;
}

.el-table .cell {
    padding: 0 !important;
}

.charts-container {
    display: flex;
    flex-wrap: wrap;
    /* 确保容器超长时能够换行 */
}

.chart-monthyear {
    width: 180px;
    /* 或你希望的宽度 */
    height: 180px;
    padding: 0;
}
</style>
