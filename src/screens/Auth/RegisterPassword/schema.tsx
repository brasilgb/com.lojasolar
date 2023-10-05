import * as Yup from 'yup';

import {ptForm} from 'yup-locale-pt';
Yup.setLocale(ptForm);

export default Yup.object().shape({
    senha: Yup.string().required('Por favor, informe uma senha').min(6),
    repitaSenha: Yup.string()
        .required('Por favor, repita a senha')
        .min(6)
        .oneOf([Yup.ref('senha')], 'Senhas devem ser iguais'),
});
