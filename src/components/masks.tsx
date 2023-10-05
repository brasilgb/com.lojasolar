function maskCep(value: string) {
    value = value?.replace(/\D/g, '');
    value = value?.replace(/^(\d{5})(\d)/, '$1-$2');
    return value;
}

function maskCelular(value: string) {
    value = value?.replace(/\D/g, '');
    value = value?.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3 $4');
    return value;
}

function maskDate(value: string) {
    value = value?.replace(/\D/g, '');
    value = value?.replace(/^(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    return value;
}

function cartNumber(value: string) {
    value = value?.replace(/\D/g, '');
    value = value?.replace(/^(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
    return value;
}

function cartValidate(value: string) {
    value = value?.replace(/\D/g, '');
    value = value?.replace(/^(\d{2})(\d{2})/, '$1/$2');
    return value;
}

function unMask(value: string) {
    value = value?.replace(/\D/g, '');
    return value;
}

export {maskCep, maskCelular, maskDate, unMask, cartNumber, cartValidate};
