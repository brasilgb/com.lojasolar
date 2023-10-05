import * as Yup from 'yup';
import {ptForm} from 'yup-locale-pt';
Yup.setLocale(ptForm);

export default Yup.object().shape({
    senha: Yup.string().required('Digite sua senha'),
});
