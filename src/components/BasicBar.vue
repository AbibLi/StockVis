<template>
  <div>
    <div ref="chartDom" style="width: 770px; height: 600px;"></div>
  </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { useBasicdataStore } from '../store/BasicData.ts'

const BasicData = useBasicdataStore();
const chartDom = ref<HTMLElement | null>(null);

/**
 * Refresh the current view when monitoring shared data changes
 */
BasicData.$subscribe(() => {
  drawChart();
})
onMounted(() => {
  drawChart()
});

/**
 * Draw a stacked bar chart
 * 
 * @remark Group stock data based on transaction types for buying, selling, dividends, and deposit, and draw a stacked bar chart
 */
const drawChart = () => {
  const tickers = [] as string[]
  const buyArr = [] as number[]
  const sellArr = [] as number[]
  const depositArr = [] as number[]
  const dividendArr = [] as number[]
  if (chartDom.value) {
    var myChart = echarts.init(chartDom.value);

    var tickerGroup = BasicData.filterStr.length > 0 && BasicData.viewType === "period" ? BasicData.getGroupByTicker(BasicData.filterData) : BasicData.getGroupByTicker()
    for (let key in tickerGroup) {
      tickers.push(key)
      let buy = 0;
      let sell = 0;
      let dividend = 0;
      let deposit = 0;
      tickerGroup[key].forEach(item => {
        if (item.Action === 'Market buy') {
          buy += item.Total_GBP
        }
        else if (item.Action === 'Market sell') {
          sell += item.Total_GBP
        }
        else if (item.Action === 'Deposit') {
          deposit += item.Total_GBP
        }
        else if (item.Action.includes('Dividend')) {
          dividend += item.Total_GBP
        }
      })
      buyArr.push(Number(buy.toFixed(2)))
      sellArr.push(Number(sell.toFixed(2)))
      depositArr.push(Number(deposit.toFixed(2)))
      dividendArr.push(Number(dividend.toFixed(2)))
    }

    var option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // Use axis to trigger tooltip
          type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
        }
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: tickers
      },
      series: [
        {
          name: 'Market buy',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data: buyArr
        },
        {
          name: 'Market sell',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data: sellArr
        },
        {
          name: 'Deposit',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data: depositArr
        },
        {
          name: 'Dividend',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data: dividendArr
        }
      ]
    };


    myChart.setOption(option);
  }
}
</script>