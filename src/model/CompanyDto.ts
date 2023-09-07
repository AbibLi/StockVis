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