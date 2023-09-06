<template>
    <div>
        <el-row>
            <el-col :span="8">
                <el-radio-group v-model="viewType">
                    <el-radio-button label="calendar">By Calendar</el-radio-button>
                    <el-radio-button label="period">By Time Period</el-radio-button>
                </el-radio-group>
            </el-col>
        </el-row>
    </div>
    <div id="calendar" v-if="viewType == 'calendar'">
        <el-calendar v-model="currentDate">
            <!-- 单元格内内容显示 -->
            <template #date-cell="{ data }">
                <p :class="data.isSelected ? 'is-selected' : ''">
                    {{ data.day.split('-').pop() }}
                    {{ data.isSelected ? '✔️' : '' }}
                </p>
                <!-- ECharts 饼图容器 -->
                <div v-if="shouldShowChart(data.day)" :ref="el => initEcharts(el as HTMLElement, data.day)"
                    style="margin-left: 20px; width: 60px; height: 60px;">
                </div>
            </template>
        </el-calendar>
    </div>
    <div id="period" v-else="viewType == 'period'">
        <Period></Period>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, nextTick, watch } from 'vue';
import * as echarts from 'echarts';
import Period from '../components/Period.vue'
import { useBasicdataStore } from '../store/BasicData.ts'
import StockDto from '../model/StockDto.ts'
import { FormatDate_yyyyMMdd } from '../helper/DateHelper'

const BasicData = useBasicdataStore()
const stockDatas = BasicData.stockDatas;
const viewType = ref(BasicData.viewType);

const currentDate = ref(new Date(BasicData.currDate));
//监听共享数据的引用， 并及时更新存储库中对应的数据，从而让使用到此共享数据的其他图表也及时刷新
watch([currentDate, viewType], ([newDate, newType]) => {
    BasicData.currDate = FormatDate_yyyyMMdd(newDate)
    BasicData.viewType = newType
});

//只显示当月日期的饼图
const shouldShowChart = (cellDate: string) => {
    const date = new Date(cellDate);
    return date.getMonth() === currentDate.value.getMonth();
};

const echartsContainers = ref<HTMLElement[]>([]);


//动态绘制日历表中饼图的方法
const initEcharts = (el: HTMLElement | null, date: string) => {
    if (!el) return;

    let total = 0;
    var BindData: any = []

    var data = stockDatas.filter(t => t.TransactionDate === date)
    if (data.length > 0) {
        var TickerGroup = GroupByTicker(data)
        for (const key in TickerGroup) {
            var value = TickerGroup[key].reduce((total, currentItem) => total + currentItem.Total_GBP, 0);
            total += value
            BindData.push({
                name: key,
                value: value,
            })
        }
    }

    nextTick(() => {
        let chart: echarts.ECharts;

        if (echarts.getInstanceByDom(el)) {
            chart = echarts.getInstanceByDom(el) as echarts.ECharts;
        } else {
            chart = echarts.init(el);
            echartsContainers.value.push(el);
        }

        if (data.length === 0) {
            chart.clear()
            return;
        }

        chart.setOption({
            series: [
                {
                    type: 'pie',
                    radius: calRadiu(total),
                    label: {
                        show: false
                    },
                    data: BindData
                }
            ]
        });
    })
};

//股票根据公司分组
const GroupByTicker = (data: StockDto[]) => {
    const groupedData = data.reduce((key, value) => {
        const groupKey = value.Ticker;

        if (!key[groupKey]) {
            key[groupKey] = [];
        }

        key[groupKey].push(value);
        return key;
    }, {} as Record<string, typeof data>);

    return groupedData
}


const calRadiu = (value: number) => {
    let radius = value / 150
    if (radius < 8) radius = 8
    else if (radius > 24) radius = 24
    return radius
}

onBeforeUnmount(() => {
    echartsContainers.value.forEach(container => {
        echarts.dispose(container);
    });
});


</script>

<style>
.is-selected {
    color: #1989fa;
}
</style>
