import * as Yup from 'yup';

import {ptForm} from 'yup-locale-pt';
Yup.setLocale(ptForm);

export default Yup.object().shape({
    email: Yup.string()
        .email('E-mail inválido')
        .required('Por favor, informe o e-mail'),
    celular: Yup.string()
        .required('Por favor, informe o celular')
        .max(13, 'Celular inválido'),
    senha: Yup.string().required('Por favor, informe uma senha').min(6),
    repitaSenha: Yup.string()
        .required('Por favor, repita a senha')
        .min(6)
        .oneOf([Yup.ref('senha')], 'Senhas devem ser iguais'),
});
