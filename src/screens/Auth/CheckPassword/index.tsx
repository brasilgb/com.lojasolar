import {View, Text, Keyboard, TextInput, Alert} from 'react-native';
import React, {useCallback, useContext, useState} from 'react';
import AppLayout from '@components/AppLayout';
import {Formik} from 'formik';
import schema from './schema';
import {AuthContext} from '@contexts/auth';
import {MaterialIcons} from '@expo/vector-icons';
import {cnpj, cpf} from 'cpf-cnpj-validator';
import AppLoading from '@components/AppLoading';
import {InputStyle, LabelStyle} from '@components/InputStyle';
import ButtomForm from '@components/ButtomForm';
import {TouchableOpacity} from 'react-native-gesture-handler';
import serviceapp from '@services/serviceapp';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {RootDrawerParamList} from '@screens/RootDrawerPrams';

interface ValuesForm {
    senha: string;
}

const CheckPassword = ({route}: any) => {
    const {data} = route.params;
    const {setLoading, loading, checkPassword} = useContext(AuthContext);
    const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    const [isChecked, setChecked] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(true);
    const formatCpfCnpj = (num: string) => {
        if (num.length < 12) {
            return cpf.format(num);
        }
        if (num.length > 11) {
            return cnpj.format(num);
        }
    };

    const onsubmit = async (values: ValuesForm, {resetForm}: any) => {
        await checkPassword({
            cpfcnpj: data.cpfCnpj,
            nomeCliente: data.nomeCliente,
            senha: values.senha,
            connected: isChecked,
            codigoCliente: data.codigoCliente,
        });
        resetForm();
    };

    const handlePassword = (cpfCnpj: any) => {
        Alert.alert(
            'Atenção',
            'Você deseja recuperar sua senha?',
            [
                {text: 'Sim', onPress: () => resetPassword(cpfCnpj)},
                {
                    text: 'Não',
                    style: 'cancel',
                },
            ],
            {cancelable: false},
        );
    };

    const resetPassword = useCallback(async (cpfCnpj: any) => {
        setLoading(true);
        const response = await serviceapp.get(
            `(WS_RECUPERA_SENHA)?cpfcnpj=${cpfCnpj}`,
        );
        const {success, message, data} = response.data.resposta;
        if (!success) {
            Alert.alert('Atenção', message);
            return;
        }
        navigation.navigate('PasswordAltered', {data: data.email});
        setLoading(false);
    }, []);

    return (
        <AppLayout>
            <AppLoading visible={loading} />
            <View className="flex-1 items-center justify-start bg-solar-gray-dark px-4">
                <View className="flex-col items-center justify-center">
                    <Text allowFontScaling={false} className="text-2xl text-solar-blue-dark py-4">
                        Faça seu login
                    </Text>
                    <Text allowFontScaling={false} className="text-base text-solar-blue-dark py-2">
                        {formatCpfCnpj(data?.cpfCnpj)}
                    </Text>
                </View>
                <Formik
                    validationSchema={schema}
                    initialValues={{
                        senha: '',
                    }}
                    enableReinitialize={true}
                    onSubmit={onsubmit}
                >
                    {({
                        values,
                        handleChange,
                        errors,
                        touched,
                        isValid,
                        handleSubmit,
                    }) => (
                        <View className="h-1/2 w-full mt-10">
                            <View className="mt-6">
                                <Text allowFontScaling={false} className={LabelStyle}>Senha</Text>
                                <View className="relative">
                                    <TextInput
                                        className={InputStyle(
                                            touched.senha,
                                            errors.senha,
                                        )}
                                        value={values.senha}
                                        // onBlur={handleBlur('senha')}
                                        onChangeText={handleChange('senha')}
                                        keyboardType="default"
                                        secureTextEntry={
                                            showPassword ? true : false
                                        }
                                    />
                                    <View className="absolute right-2 top-4">
                                        {showPassword ? (
                                            <MaterialIcons
                                                onPress={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                name="visibility"
                                                size={32}
                                                color={'#858383'}
                                            />
                                        ) : (
                                            <MaterialIcons
                                                onPress={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                name="visibility-off"
                                                size={32}
                                                color={'#858383'}
                                            />
                                        )}
                                    </View>
                                </View>
                                {errors.senha && touched.senha && (
                                    <Text allowFontScaling={false} className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                        {errors.senha}
                                    </Text>
                                )}
                                <View className="flex-row items-center justify-between px-2 mt-4">
                                    <TouchableOpacity
                                        onPress={() => setChecked(!isChecked)}
                                        activeOpacity={1}
                                        className="flex-row items-center justify-start"
                                    >
                                        <View
                                            className={`border-2 rounded ${
                                                isChecked
                                                    ? 'border-solar-orange-middle bg-solar-orange-middle'
                                                    : 'border-gray-600'
                                            }  h-4 w-4 mr-2`}
                                        >
                                            {isChecked && (
                                                <MaterialIcons
                                                    name="check"
                                                    color={
                                                        isChecked && '#FFFFFF'
                                                    }
                                                />
                                            )}
                                        </View>
                                        <Text allowFontScaling={false} className="text-sm font-PoppinsMedium text-gray-600">
                                            Continuar logado
                                        </Text>
                                    </TouchableOpacity>
                                    <View>
                                        <TouchableOpacity
                                            onPress={() =>
                                                handlePassword(data.cpfCnpj)
                                            }
                                        >
                                            <Text allowFontScaling={false} className="text-sm font-PoppinsMedium text-solar-yellow-dark underline">
                                                Esqueci a senha
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <View className="my-6">
                                <ButtomForm
                                    isValid={isValid}
                                    title="Entrar"
                                    onPress={handleSubmit}
                                />
                            </View>
                        </View>
                    )}
                </Formik>
            </View>
        </AppLayout>
    );
};

export default CheckPassword;
