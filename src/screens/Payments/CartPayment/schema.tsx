import * as Yup from 'yup';

import {ptForm} from 'yup-locale-pt';
Yup.setLocale(ptForm);

export default Yup.object().shape({
    numeroCartao: Yup.string().required('Campo obrigatório'),
    nomeCartao: Yup.string().required('Campo obrigatório'),
    validadeCartao: Yup.string().required('Campo obrigatório'),
    cvvCartao: Yup.string().min(3,'Minimo 3 caracteres').required('Campo obrigatório')
});
