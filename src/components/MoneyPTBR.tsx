import React from 'react';
import numbro from 'numbro';

export default function MoneySemSimbolo({number}: any) {
    return (
        <>
            {numbro(number).format({
                thousandSeparated: true,
                mantissa: 2,
            })}
        </>
    );
}
