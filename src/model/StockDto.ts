// export default class StockDto {
//     Account: number | undefined;
//     Action: string | undefined;
//     TransactionDate: string | unknown;
//     ISIN: string | undefined;
//     Ticker: string | undefined;
//     Name: string | undefined;
//     NoOfShares: number | undefined;
//     PriceShare: number | undefined;
//     Result_GBP: number | undefined;
//     Total_GBP: number | undefined;
//     WithholdingTax: number | undefined;
//     ChargeAmount_GBP: number | undefined;
//     DepositFee_GBP: number | undefined;
//     TransactionFee_GBP: number | undefined;
//     FinraFee_GBP: number | undefined;
//     CurrencyConversionFee_GBP: number | undefined;
//     StampDutyReserveTax_GBP: number | undefined
// }

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