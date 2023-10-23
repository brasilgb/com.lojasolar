import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Keyboard,
    Alert,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import AppLayout from '@components/AppLayout';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import { MaterialIcons } from '@expo/vector-icons';
import AppLoading from '@components/AppLoading';
import { AuthContext } from '@contexts/auth';
import { Formik } from 'formik';
import schema from './schema';
import { TextInput } from 'react-native-gesture-handler';
import { InputStyle, LabelStyle } from '@components/InputStyle';
import ButtomForm from '@components/ButtomForm';
import serviceapp from '@services/serviceapp';
import Select from '@components/Select';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@screens/RootStackPrams';
import { maskCelular, maskCep, maskDate, unMask } from '@components/masks';

interface FormProps {
    cpfcnpj: any;
    nomeCliente: string;
    enderecoCliente: string;
    cepCliente: string;
    cidadeCliente: string;
    ufCliente: string;
    celularCliente: string;
    emailCliente: string;
    nascimentoCliente: string;
}

const RegisterUser = ({ route }: any) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { setLoading, loading, disconnect } = useContext(AuthContext);
    const { data } = route.params;

    const [ufs, setUfs] = useState<any>([]);
    const [cities, setCities] = useState<any>([]);
    const [ufSelected, setUfSelected] = useState('');
    const [citySelected, setCitySelected] = useState('');

    useEffect(() => {
        const getUfs = async () => {
            await serviceapp.get('(WS_CARREGA_UF)').then(response => {
                const { data } = response.data.resposta;
                const resUfs = data.map((u: any) => u.uf);
                setUfs(resUfs);
            });
        };
        getUfs();
    }, []);

    useEffect(() => {
        const getCities = async () => {
            await serviceapp
                .get(`(WS_CARREGA_CIDADE)?uf=${ufSelected}`)
                .then(response => {
                    const { data } = response.data.resposta;
                    const resCities = data.map((c: any) => c.cidade);
                    setCities(resCities);
                });
        };
        getCities();
    }, [ufSelected]);

    const formatCpfCnpj = (num: string) => {
        if (num?.length < 12) {
            return cpf?.format(num);
        }
        if (num?.length > 11) {
            return cnpj?.format(num);
        }
    };

    const onsubmit = async (values: FormProps, { resetForm }: any) => {
        Keyboard.dismiss();
        setLoading(true);
        const response = await serviceapp.get(
            `(WS_PRIMEIRO_ACESSO)?cpfcnpj=${values.cpfcnpj}&nomeCliente=${values.nomeCliente
            }&enderecoCliente=${values.enderecoCliente}&cepCliente=${unMask(
                values.cepCliente,
            )}&cidadeCliente=${values.cidadeCliente}&ufCliente=${values.ufCliente
            }&celularCliente=${values.celularCliente}&emailCliente=${values.emailCliente
            }&nascimentoCliente=${values.nascimentoCliente}`,
        );
        const { success, message } = response.data.resposta;
        setLoading(false);
        if (!success) {
            Alert.alert('Atenção', message, [
                {
                    text: 'Ok',
                    onPress: () => {
                        navigation.navigate('Home');
                        disconnect();
                    },
                },
            ]);
        }

        navigation.navigate('Registered', { data: data });
    };

    return (
        <AppLayout>
            <AppLoading visible={loading} />
            <View className="flex-1 bg-solar-gray-dark px-4">
                <KeyboardAvoidingView
                    behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={75}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="flex-col items-center justify-center mb-2">
                            <Text className="text-3xl text-solar-blue-dark py-4 px-8 text-center">
                                Faça seu cadastro nas lojas solar!
                            </Text>
                            <Text className="text-base text-solar-blue-dark py-2">
                                Ou preencha o formulário abaixo
                            </Text>
                        </View>
                        <View className="flex-row items-center justify-start border-t border-gray-300 pt-4">
                            <MaterialIcons
                                name="warning"
                                size={20}
                                color={'#f78888'}
                            />
                            <Text className="text-sm ml-1 text-gray-500">
                                Todos os dados são obrigatórios
                            </Text>
                        </View>

                        <Formik
                            validationSchema={schema}
                            initialValues={{
                                cpfcnpj: formatCpfCnpj(data.cpfCnpj),
                                nomeCliente: '',
                                enderecoCliente: '',
                                cepCliente: '',
                                cidadeCliente: '',
                                ufCliente: '',
                                celularCliente: '',
                                emailCliente: '',
                                nascimentoCliente: '',
                            }}
                            onSubmit={onsubmit}
                        >
                            {({
                                handleSubmit,
                                handleBlur,
                                handleChange,
                                values,
                                touched,
                                errors,
                                isValid,
                            }) => (
                                <View className="mt-6">
                                    <View className="">
                                        <Text className={LabelStyle}>
                                            CPF ou CNPJ
                                        </Text>
                                        <TextInput
                                            className={`${InputStyle()} bg-gray-200`}
                                            value={values.cpfcnpj}
                                            editable={false}
                                        />
                                    </View>

                                    <View className="mt-6">
                                        <Text className={LabelStyle}>
                                            Nome completo
                                        </Text>
                                        <TextInput
                                            className={InputStyle(
                                                touched.nomeCliente,
                                                errors.nomeCliente,
                                            )}
                                            autoCapitalize="characters"
                                            value={values.nomeCliente}
                                            onBlur={handleBlur('nomeCliente')}
                                            onChangeText={handleChange(
                                                'nomeCliente',
                                            )}
                                        />
                                        {errors.nomeCliente &&
                                            touched.nomeCliente && (
                                                <Text className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                    {errors.nomeCliente}
                                                </Text>
                                            )}
                                    </View>

                                    <View className="mt-6">
                                        <Text className={LabelStyle}>
                                            Endereço
                                        </Text>
                                        <TextInput
                                            className={InputStyle(
                                                touched.enderecoCliente,
                                                errors.enderecoCliente,
                                            )}
                                            autoCapitalize="characters"
                                            value={values.enderecoCliente}
                                            onBlur={handleBlur(
                                                'enderecoCliente',
                                            )}
                                            onChangeText={handleChange(
                                                'enderecoCliente',
                                            )}
                                        />
                                        {errors.enderecoCliente &&
                                            touched.enderecoCliente && (
                                                <Text className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                    {errors.enderecoCliente}
                                                </Text>
                                            )}
                                    </View>

                                    <View className="mt-6">
                                        <Text className={LabelStyle}>CEP</Text>
                                        <TextInput
                                            className={InputStyle(
                                                touched.cepCliente,
                                                errors.cepCliente,
                                            )}
                                            value={maskCep(values.cepCliente)}
                                            keyboardType="numeric"
                                            maxLength={9}
                                            onBlur={handleBlur('cepCliente')}
                                            onChangeText={handleChange(
                                                'cepCliente',
                                            )}
                                        />

                                        {errors.cepCliente &&
                                            touched.cepCliente && (
                                                <Text className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                    {errors.cepCliente}
                                                </Text>
                                            )}
                                    </View>

                                    <View className="mt-6">
                                        <Text className={LabelStyle}>
                                            Estado
                                        </Text>
                                        <Select
                                            data={ufs}
                                            onChangeSelect={(id: any) =>
                                                setUfSelected(id)
                                            }
                                            text="Selecione o estado"
                                            value={
                                                (values.ufCliente = ufSelected)
                                            }
                                            onchangetext={handleChange(
                                                'ufCliente',
                                            )}
                                            onblur={handleBlur('ufCliente')}
                                            height="h-64"
                                            showSearch={false}
                                        />
                                        {errors.ufCliente &&
                                            touched.ufCliente && (
                                                <Text className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                    {errors.ufCliente}
                                                </Text>
                                            )}
                                    </View>

                                    <View className="mt-6">
                                        <Text className={LabelStyle}>
                                            Cidade
                                        </Text>
                                        <Select
                                            data={cities}
                                            onChangeSelect={(id: any) =>
                                                setCitySelected(id)
                                            }
                                            text="Selecione a cidade"
                                            value={
                                                (values.cidadeCliente =
                                                    citySelected)
                                            }
                                            onchangetext={handleChange(
                                                'cidadeCliente',
                                            )}
                                            onblur={handleBlur('cidadeCliente')}
                                            height="h-full"
                                            showSearch={true}
                                        />
                                        {errors.cidadeCliente &&
                                            touched.cidadeCliente && (
                                                <Text className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                    {errors.cidadeCliente}
                                                </Text>
                                            )}
                                    </View>

                                    <View className="mt-6">
                                        <Text className={LabelStyle}>
                                            Celular
                                        </Text>
                                        <TextInput
                                            className={InputStyle(
                                                touched.celularCliente,
                                                errors.celularCliente,
                                            )}
                                            keyboardType="numeric"
                                            maxLength={16}
                                            value={maskCelular(
                                                values.celularCliente,
                                            )}
                                            onBlur={handleBlur(
                                                'celularCliente',
                                            )}
                                            onChangeText={handleChange(
                                                'celularCliente',
                                            )}
                                        />
                                        {errors.celularCliente &&
                                            touched.celularCliente && (
                                                <Text className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                    {errors.celularCliente}
                                                </Text>
                                            )}
                                    </View>

                                    <View className="mt-6">
                                        <Text className={LabelStyle}>
                                            E-mail
                                        </Text>
                                        <TextInput
                                            className={InputStyle(
                                                touched.emailCliente,
                                                errors.emailCliente,
                                            )}
                                            autoCapitalize="characters"
                                            keyboardType="email-address"
                                            value={values.emailCliente}
                                            onBlur={handleBlur('emailCliente')}
                                            onChangeText={handleChange(
                                                'emailCliente',
                                            )}
                                        />
                                        {errors.emailCliente &&
                                            touched.emailCliente && (
                                                <Text className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                    {errors.emailCliente}
                                                </Text>
                                            )}
                                    </View>

                                    <View className="mt-6">
                                        <Text className={LabelStyle}>
                                            Data nascimento
                                        </Text>
                                        <TextInput
                                            className={InputStyle(
                                                touched.nascimentoCliente,
                                                errors.nascimentoCliente,
                                            )}
                                            autoCapitalize="characters"
                                            value={maskDate(
                                                values.nascimentoCliente,
                                            )}
                                            onBlur={handleBlur(
                                                'nascimentoCliente',
                                            )}
                                            onChangeText={handleChange(
                                                'nascimentoCliente',
                                            )}
                                            maxLength={10}
                                            keyboardType="numeric"
                                        />
                                        {errors.nascimentoCliente &&
                                            touched.nascimentoCliente && (
                                                <Text className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                    {errors.nascimentoCliente}
                                                </Text>
                                            )}
                                    </View>

                                    <View className="my-6">
                                        <ButtomForm
                                            isValid={isValid}
                                            title="Continuar"
                                            onPress={handleSubmit}
                                        />
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </AppLayout>
    );
};

export default RegisterUser;
