import * as Yup from 'yup';
import {ptForm} from 'yup-locale-pt';
import {cnpj, cpf} from 'cpf-cnpj-validator';
Yup.setLocale(ptForm);

const validateCpfCnpj = async (num: string) => {
    if (num.length < 12) {
        return await cpf.isValid(num);
    }
    if (num.length > 11) {
        return await cnpj.isValid(num);
    }
};

export default Yup.object().shape({
    cpfcnpj: Yup.string()
        .required('Digite seu CPF ou CNPJ')
        .test(
            'cpfcnpj_check',
            'CPF ou CNPJ inválido',
            async value => (await validateCpfCnpj(value)) === true,
        ),
});
