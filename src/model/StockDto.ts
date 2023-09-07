export default interface StockDto {
    Account: number;
    Action: string;
    TransactionDate: string | unknown;
    ISIN: string;
    Ticker: string;
    Name: string;
    NoOfShares: number;
    PriceShare: number;
    Result_GBP: number;
    Total_GBP: number;
    WithholdingTax: number;
    ChargeAmount_GBP: number;
    DepositFee_GBP: number;
    TransactionFee_GBP: number;
    FinraFee_GBP: number;
    CurrencyConversionFee_GBP: number;
    StampDutyReserveTax_GBP: number;
}