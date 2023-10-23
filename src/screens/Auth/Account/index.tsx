import {
    View,
    Text,
    TextInput,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    Keyboard,
    Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AppLayout from '@components/AppLayout';
import {MaterialIcons} from '@expo/vector-icons';
import {Formik} from 'formik';
import {InputStyle, LabelStyle} from '@components/InputStyle';
import ButtomForm from '@components/ButtomForm';
import schema from './schema';
import {maskCelular, maskCep, maskDate, unMask} from '@components/masks';
import Select from '@components/Select';
import serviceapp from '@services/serviceapp';
import {cnpj, cpf} from 'cpf-cnpj-validator';
import {AuthContext} from '@contexts/auth';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '@screens/RootStackPrams';
import AppLoading from '@components/AppLoading';

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
const Account = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const {user, setLoading, disconnect, loading} = useContext(AuthContext);
    const tokenUser = user.token;
    const [ufs, setUfs] = useState<any>([]);
    const [cities, setCities] = useState<any>([]);
    const [ufSelected, setUfSelected] = useState('');
    const [citySelected, setCitySelected] = useState('');
    const [accounts, setAccounts] = useState<any>([]);

    useEffect(() => {
        const getUfs = async () => {
            await serviceapp.get('(WS_CARREGA_UF)').then(response => {
                const {data} = response.data.resposta;
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
                    const {data} = response.data.resposta;
                    const resCities = data.map((c: any) => c.cidade);
                    setCities(resCities);
                });
        };
        getCities();
    }, [ufSelected]);

    useEffect(() => {
        const getAccount = async () => {
            setLoading(true);
            await serviceapp
                .get(`(WS_CARREGA_CLIENTE)?token=${tokenUser}`)
                .then(response => {
                    const {data, message, token} = response.data.resposta;
                    if (!token) {
                        setLoading(false);
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
                    setUfSelected(data.ufCliente);
                    setCitySelected(data.cidadeCliente);
                    setAccounts(data);
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => setLoading(false));
        };
        getAccount();
    }, [tokenUser]);

    // Formatação CPF CNPJ
    const formatCpfCnpj = (num: string) => {
        if (num?.length < 12) {
            return cpf?.format(num);
        }
        if (num?.length > 11) {
            return cnpj?.format(num);
        }
    };

    const onSubmit = async (values: FormProps) => {
        setLoading(true);
        Keyboard.dismiss();
        const response = await serviceapp.get(
            `(WS_ALTERA_CLIENTE)?token=${tokenUser}&nomeCliente=${
                values.nomeCliente
            }&enderecoCliente=${values.enderecoCliente}&cepCliente=${unMask(
                values.cepCliente,
            )}&cidadeCliente=${values.cidadeCliente}&ufCliente=${
                values.ufCliente
            }&celularCliente=${unMask(values.celularCliente)}&emailCliente=${
                values.emailCliente
            }&nascimentoCliente=${values.nascimentoCliente}`,
        );
        const {success, message,  } = response.data.resposta;
        if (success) {
            setLoading(false);
            Alert.alert('Atenção', message, [
                {text: 'Ok', onPress: () => navigation.navigate('Home')},
            ]);
        }
    };

    return (
        <AppLayout>
            <AppLoading visible={loading} />
            <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={75}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 bg-solar-gray-dark px-4">
                        <View className="py-4 flex items-center border-b border-b-gray-300">
                            <Text className="text-2xl text-solar-blue-dark font-PoppinsMedium">
                                Meus dados
                            </Text>
                        </View>

                        <View className="flex-row items-center justify-start py-3 mb-3">
                            <MaterialIcons
                                name="account-circle"
                                size={50}
                                color={'#154295'}
                            />
                            <View>
                                <Text
                                    numberOfLines={1}
                                    className="text-sm w-60 text-solar-blue-dark font-PoppinsMedium"
                                >
                                    {accounts.nomeCliente}
                                </Text>
                                <Text className="text-base mr-4 w-60 text-solar-blue-dark font-Poppins_400Regular">
                                    Confira seus dados abaixo e se necessário,
                                    atualize-os
                                </Text>
                            </View>
                        </View>

                        <Formik
                            validationSchema={schema}
                            initialValues={{
                                cpfcnpj: formatCpfCnpj(accounts.cpfcnpj),
                                nomeCliente: accounts.nomeCliente,
                                enderecoCliente: accounts.enderecoCliente,
                                cepCliente: maskCep(
                                    JSON.stringify(accounts?.cepCliente),
                                ),
                                cidadeCliente: accounts.cidadeCliente
                                    ? accounts.cidadeCliente
                                    : 'Selecione a cidade',
                                ufCliente: accounts.ufCliente
                                    ? accounts.ufCliente
                                    : 'selecione o estado',
                                celularCliente: maskCelular(
                                    accounts.celularCliente,
                                ),
                                emailCliente: accounts.emailCliente,
                                nascimentoCliente: maskDate(
                                    accounts.nascimentoCliente,
                                ),
                            }}
                            enableReinitialize
                            onSubmit={onSubmit}
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
                                            value={values.enderecoCliente}
                                            onBlur={handleBlur(
                                                'enderecoCliente',
                                            )}
                                            onChangeText={handleChange(
                                                'enderecoCliente',
                                            )}
                                            autoCapitalize="characters"
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
                                            value={values.cepCliente}
                                            onBlur={handleBlur('cepCliente')}
                                            onChangeText={handleChange(
                                                'cepCliente',
                                            )}
                                            maxLength={9}
                                            keyboardType="numeric"
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
                                            value={maskCelular(
                                                values.celularCliente,
                                            )}
                                            autoCapitalize="characters"
                                            onBlur={handleBlur(
                                                'celularCliente',
                                            )}
                                            onChangeText={handleChange(
                                                'celularCliente',
                                            )}
                                            maxLength={16}
                                            keyboardType="numeric"
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
                                            value={values.emailCliente}
                                            autoCapitalize="characters"
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
                                            Data de nascimento
                                        </Text>
                                        <TextInput
                                            className={InputStyle(
                                                errors.nascimentoCliente,
                                                touched.nascimentoCliente,
                                            )}
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
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </AppLayout>
    );
};

export default Account;
