import React from 'react';
import numbro from 'numbro';

numbro.registerLanguage({
    languageTag: 'pt-BR',
    delimiters: {
        thousands: '.',
        decimal: ',',
    },
    abbreviations: {
        thousand: 'mil',
        million: 'milhões',
        billion: 'b',
        trillion: 't',
    },
    ordinal: function () {
        return 'º';
    },
    currency: {
        symbol: 'R$',
        position: 'prefix',
        code: 'BRL',
    },
    currencyFormat: {
        thousandSeparated: true,
        totalLength: 4,
        spaceSeparated: true,
        average: true,
    },
    formats: {
        fourDigits: {
            totalLength: 4,
            spaceSeparated: true,
            average: true,
        },
        fullWithTwoDecimals: {
            output: 'currency',
            mantissa: 2,
            spaceSeparated: true,
            thousandSeparated: true,
        },
        fullWithTwoDecimalsNoCurrency: {
            mantissa: 2,
            thousandSeparated: true,
        },
        fullWithNoDecimals: {
            output: 'currency',
            spaceSeparated: true,
            thousandSeparated: true,
            mantissa: 0,
        },
    },
});

numbro.setLanguage('pt-BR');
const MoneyPTBR = (number: number) => {
    return (
        <>
            {numbro(number).formatCurrency({
                thousandSeparated: true,
                mantissa: 2,
            })}
        </>
    );
};
export default MoneyPTBR;
