export default class CompanyDto {
    No: number | undefined;
    Company = '';
    Ticker = '';
    DateOfFirstPurchase = '';
    DateOfLastPurchase = '';
    NumberOfSharesPurchased: number | undefined;
    TotalPurchasedPrice: number | undefined;
    AveragePricePerShare: number | undefined;
    DateOfFirstSell = '';
    DateOfLastSell = '';
    TotalNumberOfSharesSold: number | undefined;
    PricePerShareLastSell: number | undefined;
    NetNumberOfShares: number | undefined;
    CurrentPrice_03082023: number | undefined;
    TotalDividends_21072023: number | undefined;
    RealizedCapitalGains_21072023: number | undefined;
    unRealizedCapitalGains_21072023: number | undefined;
    InvestmentPerformance:number |undefined;
}

// export default interface CompanyDto {
//     No: number;
//     Company: string;
//     Ticker: string;
//     DateOfFirstPurchase: string;
//     DateOfLastPurchase: string;
//     NumberOfSharesPurchased: number;
//     TotalPurchasedPrice: number
//     AveragePricePerShare: number;
//     DateOfFirstSell: string;
//     DateOfLastSell: string;
//     TotalNumberOfSharesSold: number;
//     PricePerShareLastSell: number;
//     NetNumberOfShares: number;
//     CurrentPrice_03082023: number;
//     TotalDividends_21072023: number;
//     RealizedCapitalGains_21072023: number;
// }