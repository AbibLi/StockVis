<template>
    <el-container>
        <el-main style="height:720px;overflow: auto;">
            <div ref="chartRef" style="width: 100%;,height: 680px;"></div>
        </el-main>
        <el-aside id="rside">
            <el-button type="danger" size='large' round style="width: 180px;margin-bottom: 20px;" @click="viewChange">Switch
                Views</el-button>
            <p>Select company :</p>
            <el-select v-model="comSelects" multiple placeholder="Select" filterable collapse-tags collapse-tags-tooltip
                :max-collapse-tags="3" @change="drawChart">
                <el-option v-for="item in CompanyData" :key="item.No" :label="`${item.Company}---${item.Ticker}`"
                    :value="item.No" />
            </el-select>
            <br />
            <br />
            <div v-show="!showStackBar">
                <p>Remove column:</p>
                <el-select v-model="axisSelects" multiple placeholder="Select" filterable collapse-tags
                    collapse-tags-tooltip :max-collapse-tags="3" @change="drawChart">
                    <el-option v-for="item in AxisTypes" :key="item.name" :label="item.name" :value="item.name" />
                </el-select>
            </div>

        </el-aside>
    </el-container>
</template>
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as echarts from 'echarts';
import CompanyDto from '../model/CompanyDto.ts'
import { useBasicdataStore } from '../store/BasicData.ts'

const chartRef = ref()
let chartInstance: any;

const BasicData = useBasicdataStore()
const CompanyData = BasicData.SortCompanyDataByInvestmentPerformance()
const AxisTypes = BasicData.getAxisTypes

const axisSelects = ref([] as string[])
const comSelects = ref([] as number[])
const showStackBar = ref(false);

onMounted(() => {
    chartInstance = echarts.init(chartRef.value)
    drawChart()
})

onBeforeUnmount(() => {
    if (chartInstance)
        chartInstance.dispose()
})

const viewChange = () => {
    showStackBar.value = !showStackBar.value
    drawChart()
}

const drawChart = () => {
    chartInstance.clear()
    if (showStackBar.value)
        drawStackedBar()
    else
        drawParallel()
}

const drawParallel = () => {
    //获取筛选后的坐标轴数据
    let curAxisSelects = AxisTypes.map(t => t.name)
    if (axisSelects.value.length > 0) {
        curAxisSelects = curAxisSelects.filter(t => !axisSelects.value.includes(t))
    }
    const schema: any = [];
    let index = 0;
    AxisTypes.forEach(item => {
        if (curAxisSelects.includes(item.name)) {
            if (item.name.includes("Date")) {
                schema.push({
                    dim: index++,
                    name: item.name,
                    type: item.type,
                    data: Array.from(new Set(CompanyData.map(t => t[item.name as keyof CompanyDto]))).sort(),
                    nameRotate: 30,
                })
            }
            else {
                schema.push({
                    dim: index++,
                    name: item.name,
                    type: item.type,
                    nameRotate: 30,
                    tooltip: { show: true }
                })
            }
        }
    })

    //根据筛选后的坐标轴及公司股票数据获取绑定到parallel的数据源
    let BindData: any = []
    CompanyData.forEach((item: CompanyDto) => {
        BindData.push(curAxisSelects.map(key => item[key as keyof CompanyDto]))
    })

    //折线的样式
    let lineStyle = {
        width: 1.5,
        opacity: 0.8,
    }
    let showHigh: boolean = false
    if (comSelects.value.length > 0) {
        showHigh = true
        lineStyle = {
            width: 1.5,
            opacity: 0.1
        }
    }

    chartRef.value.style = "height:680px";
    chartInstance.resize();
    const option = {
        // backgroundColor: '#333',
        tooltip: {
            padding: 10,
            backgroundColor: '#B2DFEE',
            // borderColor: '#777',
            // borderWidth: 1,
        },
        parallelAxis: [...schema],
        visualMap: {
            show: true,
            min: 0,
            max: 80,
            dimension: 0,//schema.length - 1,
            inRange: {
                color: ['#d94e5d', '#eac736', '#50a3ba'].reverse(),
            }
        },
        parallel: {
            left: '5%',
            bottom: 20,
            layout: 'horizontal',
            width: '90%',
            parallelAxisDefault: {
                type: 'value',
                nameLocation: 'end',
                nameGap: 15,
                nameTextStyle: {
                    color: '#000',
                    fontSize: 11,
                },
                axisLine: {
                    lineStyle: {
                        color: '#000'
                    }
                },
                axisTick: {
                    lineStyle: {
                        color: '#333'
                    }
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    color: '#333'
                }
            }
        },
        series: [
            {
                type: 'parallel',
                lineStyle: lineStyle,
                emphasis: {
                    lineStyle: {
                        width: 2,
                        opacity: 1,
                    }
                },
                data: BindData,
            }
        ]
    };

    chartInstance.setOption(option)

    if (showHigh) {
        let highIndexs: number[] = []
        highIndexs = comSelects.value.map(t => CompanyData.map(x => x.No).indexOf(t))
        chartInstance.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: highIndexs
        })
    }
}

const drawStackedBar = () => {
    var companys = [] as string[]
    var companysLabels = [] as string[]
    var gains = [] as number[]
    var dividends = [] as number[]
    for (let item of CompanyData) {
        if (comSelects.value.length > 0 && !comSelects.value.includes(item.No as number)) {
            continue
        }
        companys.push(`${item.Company}(${item.Ticker})`)
        companysLabels.push(`${item.Company}(${item.Ticker})： £${item.InvestmentPerformance}`)
        let gain = Number(item.RealizedCapitalGains_21072023) + Number(item.unRealizedCapitalGains_21072023)
        gains.push(Number(gain.toFixed(2)))
        dividends.push(Number(item.TotalDividends_21072023?.toFixed(2)))
    }

    if (companys.length <= 10) {
        chartRef.value.style.height = `${companys.length * 55 + 85}px`;
    }
    else if (companys.length <= 15) {
        chartRef.value.style.height = `${companys.length * 35 + 135}px`;
    }
    else if (companys.length <= 30) {
        chartRef.value.style.height = "650px";
    }
    else {
        chartRef.value.style.height = `${companys.length * 19}px`;
    }
    chartInstance.resize();
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
            data: companysLabels
        },
        series: [
            {
                name: 'Captial gains&loss',
                type: 'bar',
                stack: 'total',
                emphasis: {
                    focus: 'series'
                },
                data: gains
            },
            {
                name: 'Total dividends',
                type: 'bar',
                stack: 'total',
                emphasis: {
                    focus: 'series'
                },
                data: dividends
            }
        ]
    };

    chartInstance.on('legendselectchanged', (params: any) => {
        var selectedSeries = params.selected;

        // 计算各列的总和
        var sums: any = {};
        companys.forEach((company, index) => {
            if (selectedSeries['Captial gains&loss']) {
                sums[company] = (sums[company] || 0) + gains[index];
            }
            if (selectedSeries['Total dividends']) {
                sums[company] = (sums[company] || 0) + dividends[index];
            }
        });

        var sortedData = companys.map((company, index) => {
            return {
                company,
                gain: gains[index],
                dividend: dividends[index],
                total: sums[company] || 0,
            };
        }).sort((a, b) => {
            if (selectedSeries['Captial gains&loss'] && selectedSeries['Total dividends']) {
                return (a.gain + a.dividend) - (b.gain + b.dividend);
            }
            if (selectedSeries['Captial gains&loss']) {
                return a.gain - b.gain;
            } else if (selectedSeries['Total dividends']) {
                return a.dividend - b.dividend;
            }
            return 0;
        });

        // 更新 Y 轴的数据和对应系列的数据
        chartInstance.setOption({
            yAxis: {
                type: 'category',
                data: sortedData.map(item => `${item.company}： £${Number(item.total.toFixed(2))}`),
            },
            series: [
                {
                    name: 'Captial gains&loss',
                    data: sortedData.map(item => item.gain),
                },
                {
                    name: 'Total dividends',
                    data: sortedData.map(item => item.dividend),
                }
            ]
        });
    });

    chartInstance.setOption(option);
}
</script>
  

<style scoped>
#rside {
    padding-top: 60px;
    padding-left: 10px;
    width: 11%;
}

p {
    color: #777;
    margin-bottom: 10px;
}
</style>