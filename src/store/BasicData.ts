import { defineStore } from 'pinia';
import CompanyDto from '../model/CompanyDto'
import StockDto from '../model/StockDto'
import companyjson from '../json/company.json'
import stockjson from '../json/stock.json'
import { formatDateFromSerial } from '../helper/DateHelper'

export const useBasicdataStore = defineStore('basicdata', {
    state: () => {
        /** 
         * Obtain the companys' data from the JSON file and convert it to the corresponding model type
         */
        const companyDatas = companyjson.CompanyData.map(item => {
            return {
                No: item.No,
                Company: item.Company,
                Ticker: item.Ticker,
                DateOfFirstPurchase: formatDateFromSerial(item.DateOfFirstPurchase as number),
                DateOfLastPurchase: formatDateFromSerial(item.DateOfLastPurchase as number),
                NumberOfSharesPurchased: item.NumberOfSharesPurchased,
                TotalPurchasedPrice: item.TotalPurchasedPrice,
                AveragePricePerShare: item.AveragePricePerShare,
                DateOfFirstSell: formatDateFromSerial(item.DateOfFirstSell as number),
                DateOfLastSell: formatDateFromSerial(item.DateOfLastSell as number),
                TotalNumberOfSharesSold: item.TotalNumberOfSharesSold,
                PricePerShareLastSell: item.PricePerShareLastSell,
                NetNumberOfShares: item.NetNumberOfShares,
                CurrentPrice_03082023: item.CurrentPrice_03082023,
                TotalDividends_21072023: item.TotalDividends_21072023,
                RealizedCapitalGains_21072023: item.RealizedCapitalGains_21072023,
                unRealizedCapitalGains_21072023: item.UnrealizedCapitalGain_21072023,
                InvestmentPerformance: item.InvestmentPerformance
            } as CompanyDto
        });

        /**
         * Obtain the stocks' data from the JSON file
         */
        const stockDatas = stockjson.StockData as StockDto[];
        stockDatas.forEach(t => t.TransactionDate = formatDateFromSerial(t.TransactionDate as number))

        return {
            companyDatas: companyDatas,
            stockDatas: stockDatas,
            currDate: '2022-07-27',
            viewType: "calendar",       //period,calendar
            startDay: '',
            endDay: '',
            filterStr: "",               //eg   --->   day:07-08;month:Jul;year:2023
            filterData: new Array<StockDto>

        }
    },
    getters: {
        /**
         * Traverse the required axes for parallel coordinate systems based on the attributes of the company model
         * 
         * @returns Axis required for parallel coordinate chart
         */
        getAxisTypes: () => {
            /**
             * Get all property names of an object
             */
            let keys = Object.keys(new CompanyDto());
            let AxisTypes = new Array<AxisType>();
            keys.forEach(value => {
                if (value === "No") return;
                AxisTypes.push({
                    name: value,
                    type: value.includes('Date') || value === 'Company' || value === 'Ticker' ? 'category' : 'value'
                })
            })
            return AxisTypes;
        },
        /**
         * Obtain stock data for the selected date
         */
        getCurrDateStocks: (state) => {
            if (state.viewType == "calendar")
                return state.stockDatas.filter(t => t.TransactionDate === state.currDate)
            else {
                let startDay = new Date(state.startDay)
                let endDay = new Date(state.endDay)
                return state.stockDatas.filter(t => new Date(String(t.TransactionDate)) >= startDay && new Date(String(t.TransactionDate)) <= endDay)
            }
        },

        /**
         * Obtain stock data grouped by company
         * @param state Pinia's state library
         * 
         * @returns Obtain stock data grouped by company
         */
        getGroupByTicker: (state) => (param: StockDto[] | undefined = undefined) => {
            let data = []
            if (param != undefined && Array.isArray(param)) {
                data = param
            }
            else if (state.viewType == "calendar")
                data = state.stockDatas.filter(t => t.TransactionDate === state.currDate)
            else {
                let startDay = new Date(state.startDay)
                let endDay = new Date(state.endDay)
                data = state.stockDatas.filter(t => new Date(String(t.TransactionDate)) >= startDay && new Date(String(t.TransactionDate)) <= endDay)
            }
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
    },
    actions: {
        /**
         * Sort Company Data By Investment Performance  
         * 
         * @returns  Sorted data
         */
        SortCompanyDataByInvestmentPerformance() {
            this.companyDatas.forEach(t => {
                t.InvestmentPerformance = Number((Number(t.TotalDividends_21072023) + Number(t.RealizedCapitalGains_21072023) + Number(t.unRealizedCapitalGains_21072023)).toFixed(2))
            })
            return this.companyDatas.sort((a, b) => Number(a.InvestmentPerformance) - Number(b.InvestmentPerformance))
        },
    }
});

interface AxisType {
    name: string,
    type: string
}
