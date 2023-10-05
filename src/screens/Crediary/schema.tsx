import {cnpj, cpf} from 'cpf-cnpj-validator';
import * as Yup from 'yup';
import {ptForm} from 'yup-locale-pt';

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
    nomeMae: Yup.string().required('Por favor, informe o nome da mãe'),
    sexo: Yup.string().required('Por favor, selecione o sexo'),
    escolaridade: Yup.string().required('Por favor, selecione a escolaridade'),
    localTrabalho: Yup.string().required(
        'Por favor, informe local de trabalho',
    ),
    estadoCivil: Yup.string().required('Por favor, selecione o estado civil'),
    nomeConjuge: Yup.string().when('estadoCivil', (estadoCivil): any => {
        if (estadoCivil[0] == 'Casado') {
            return Yup.string().required(
                'Por favor, informe o nome do conjuge',
            );
        }
    }),
    cpfConjuge: Yup.string().when('estadoCivil', (estadoCivil): any => {
        if (estadoCivil[0] == 'Casado') {
            return Yup.string()
                .required('Por favor, informe o cpf do conjuge')
                .test(
                    'cpfcnpj_check',
                    'CPF ou CNPJ inválido',
                    async value => (await validateCpfCnpj(value)) === true,
                );
        }
    }),
    profissao: Yup.string().required('Por favor, selecione a profissão'),
    renda: Yup.string().required('Por favor, informe a renda'),
});
