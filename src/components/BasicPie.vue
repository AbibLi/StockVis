<template>
    <div>
        <div ref="chartDom" style="width: 850px; height: 700px;"></div>
    </div>
</template>
    
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { useBasicdataStore } from '../store/BasicData.ts'

const BasicData = useBasicdataStore();

const chartDom = ref<HTMLElement | null>(null);
let myChart: any;

/**
 * Refresh the current view when monitoring shared data changes
 */
BasicData.$subscribe(() => {
    drawChart();
})

onMounted(() => {
    myChart = echarts.init(chartDom.value)
    drawChart()
});

onBeforeUnmount(() => {
    if (myChart)
        myChart.dispose()
})

/**
 * Draw a stacked bar chart
 * 
 * @remark Group the shares in the shared state inventory by company and draw a pie chart to display the proportion of the company's stock trading volume at the current time
 */
const drawChart = () => {
    if (chartDom.value) {
        var BindData: any = []
        var data = BasicData.getCurrDateStocks
        if (data.length > 0) {
            var tickerGroup = BasicData.filterStr.length > 0 && BasicData.viewType === "period" ? BasicData.getGroupByTicker(BasicData.filterData) : BasicData.getGroupByTicker();
            for (const key in tickerGroup) {
                var value = tickerGroup[key].reduce((total, currentItem) => total + currentItem.Total_GBP, 0);
                BindData.push({
                    name: key,
                    value: Number(value.toFixed(2)),
                    tranNum: tickerGroup[key].length
                })
            }
        }

        myChart.clear()
        var option: echarts.EChartsOption = {
            title: {
                text: 'Total Trading Volume of Stocks',
                subtext: BasicData.viewType === "calendar" ? BasicData.currDate : BasicData.startDay + " ~ " + BasicData.endDay + "    " + BasicData.filterStr,
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => {
                    const data = params.data;
                    const defaultTooltip = params.marker + params.name + '<br>' + 'Total:&nbsp&nbsp £' + params.value + '<br>';
                    return defaultTooltip + `Transaction Number:&nbsp ${data.tranNum}`
                },
            },
            legend: {
                orient: 'vertical',
                left: 'right'
            },
            series: [
                {
                    name: 'Total_GBP',
                    type: 'pie',
                    radius: '70%',
                    center: ['42%', '50%'],
                    data: BindData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    }
}
</script>