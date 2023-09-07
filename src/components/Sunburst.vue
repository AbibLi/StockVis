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
 * Draw a sunburst chart
 * 
 * @remark
 * Group stock data by transaction type and company, and then draw a sunburst chart,
 * Used to display the proportion of data volume for each transaction type and the proportion of companies under each transaction type 
 */
const drawChart = () => {
  if (chartDom.value) {
    var BindData: any = [
      { name: "Market buy", value: 0, tranNum: 0, children: [] },
      { name: "Market sell", value: 0, tranNum: 0, children: [] },
      { name: "Deposit", value: 0, tranNum: 0, children: [] },
      { name: "Dividend", value: 0, tranNum: 0, children: [] }
    ]
    var data = BasicData.filterStr.length > 0 && BasicData.viewType === "period" ? BasicData.filterData : BasicData.getCurrDateStocks;
    if (data?.length > 0) {
      var tickerGroup = BasicData.getGroupByTicker(data);
      for (let key in tickerGroup) {
        let buyArr = tickerGroup[key].filter(t => t.Action === 'Market buy')
        if (buyArr.length > 0) {
          let value = buyArr.reduce((total, currentItem) => total + currentItem.Total_GBP, 0);
          BindData[0].value = Number((BindData[0].value + value).toFixed(2))
          BindData[0].tranNum += buyArr.length
          BindData[0].children.push({
            name: key,
            value: Number(value.toFixed(2)),
            tranNum: buyArr.length
          })
        }
        let sellArr = tickerGroup[key].filter(t => t.Action === 'Market sell')
        if (sellArr.length > 0) {
          let value = sellArr.reduce((total, currentItem) => total + currentItem.Total_GBP, 0);
          BindData[1].value = Number((BindData[1].value + value).toFixed(2))
          BindData[1].tranNum += sellArr.length
          BindData[1].children.push({
            name: key,
            value: Number(value.toFixed(2)),
            tranNum: sellArr.length
          })
        }
        let depositArr = tickerGroup[key].filter(t => t.Action === 'Deposit')
        if (depositArr.length > 0) {
          let value = depositArr.reduce((total, currentItem) => total + currentItem.Total_GBP, 0);
          BindData[2].value = Number((BindData[2].value + value).toFixed(2))
          BindData[2].tranNum += depositArr.length
          BindData[2].children.push({
            name: key,
            value: Number(value.toFixed(2)),
            tranNum: depositArr.length
          })
        }
        let dividendArr = tickerGroup[key].filter(t => t.Action.includes('Dividend'))
        if (dividendArr.length > 0) {
          let value = dividendArr.reduce((total, currentItem) => total + currentItem.Total_GBP, 0);
          BindData[3].value = Number((BindData[3].value + value).toFixed(2))
          BindData[3].tranNum += dividendArr.length
          BindData[3].children.push({
            name: key,
            value: Number(value.toFixed(2)),
            tranNum: dividendArr.length
          })
        }
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
          let tranNum = data.tranNum
          if (params.name == "Total transaction amount") {
            tranNum = data.children.reduce((total: number, currentItem: any) => total + currentItem.tranNum, 0);
          }
          return defaultTooltip + `Transaction Number:&nbsp ${tranNum}`
        },
      },
      series: [
        {
          name: 'Total transaction amount',
          type: 'sunburst',
          data: BindData,
          center: ['50%', '55%'],
          radius: [0, '75%'],
          label: {
            position: 'inside',
            align: 'center',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          levels: [
            {
              label: {
                rotate: "tangential"
              },
            },
            //内圈
            {
              label: {
                rotate: "radial"
              },
            },
            //外圈
            {
              label: {
                position: 'outside',
                rotate: 'radial'

              },
            },
          ],
        }
      ],
    };
    myChart.setOption(option);
  }
}
</script>