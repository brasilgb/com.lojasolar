import * as Yup from 'yup';

import {ptForm} from 'yup-locale-pt';
Yup.setLocale(ptForm);

export default Yup.object().shape({
    nomeCliente: Yup.string().required('Por favor, informe seu nome'),
    enderecoCliente: Yup.string().required('Por favor, informe seu endereço'),
    cepCliente: Yup.string()
        .min(9, 'CEP inválido')
        .required('Por favor, informe o CEP'),
    cidadeCliente: Yup.string().required('Por favor, selecione o Estado'),
    ufCliente: Yup.string().required('Por favor, selecione a cidade'),
    celularCliente: Yup.string()
        .min(11, 'Celular inválido')
        .required('Por favor, informe o telefone'),
    emailCliente: Yup.string()
        .email('E-mail inválido')
        .required('Por favor, informe o e-mail'),
});
