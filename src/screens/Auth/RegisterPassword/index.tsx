import {
    View,
    Text,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    TextInput,
    Alert,
    Keyboard,
} from 'react-native';
import React, { useCallback, useContext, useState } from 'react';
import AppLayout from '@components/AppLayout';
import AppLoading from '@components/AppLoading';
import { AuthContext } from '@contexts/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import { InputStyle, LabelStyle } from '@components/InputStyle';
import ButtomForm from '@components/ButtomForm';
import schema from './schema';
import serviceapp from '@services/serviceapp';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '@screens/RootDrawerPrams';
import { maskCelular } from "@components/masks";

interface SenhaProps {
    email: string;
    celular: string;
    senha: string;
    repitaSenha: string;
}

const RegisterPassword = ({ route }: any) => {
    const navigation =
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    const { setLoading, loading, disconnect } = useContext(AuthContext);
    const [showPassword1, setShowPassword1] = useState<boolean>(true);
    const [showPassword2, setShowPassword2] = useState<boolean>(true);

    const { data } = route?.params;

    const onsubmit = useCallback(
        async (values: SenhaProps, { resetForm }: any) => {
            setLoading(true);
            await serviceapp
                .get(
                    `(WS_ALTERAR_SENHA_APP)?cpfcnpj=${data.cpfCnpj}&senha=${values.senha}&emailCliente=${values.email}&celularCliente=${values.celular}`,
                )
                .then(response => {
                    const { success, message } = response.data.resposta;
                    setLoading(false);
                    resetForm();
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
                    navigation.navigate('PasswordChanged', { data: data });
                    Keyboard.dismiss();
                })
                .catch(error => {
                    console.log(error);
                });
        },
        [],
    );

    return (
        <AppLayout>
            <AppLoading visible={loading} />
            <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={75}
                className="flex-1 bg-solar-gray-dark "
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="px-4">
                        <View className="py-4 flex items-center justify-center">
                            <Text className="text-2xl text-solar-blue-dark font-PoppinsMedium mb-4 pb-2 text-center">
                                Este é seu primeiro acesso?
                            </Text>
                            <Text className="text-base text-solar-blue-dark py-2 pb-6 border-b border-b-gray-300 w-full text-center">
                                por favor, defina uma senha que você irá
                                utilizar sempre que fizer login no aplicativo
                                das Lojas Solar
                            </Text>
                            <View className="flex-row items-center justify-start w-full pt-4">
                                <MaterialIcons
                                    name="warning"
                                    size={20}
                                    color={'#f78888'}
                                />
                                <Text className="text-sm ml-1 text-gray-500">
                                    Sua senha precisa ter no mínimo 6 caracteres
                                </Text>
                            </View>
                        </View>
                        <Formik
                            validationSchema={schema}
                            initialValues={{
                                email: '',
                                celular: '',
                                senha: '',
                                repitaSenha: '',
                            }}
                            enableReinitialize
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


                                    <View className="mt-6">
                                        <Text className={LabelStyle}>
                                            Insira seu e-mail
                                        </Text>
                                        <View className="">
                                            <TextInput
                                                className={InputStyle(
                                                    touched.email,
                                                    errors.email,
                                                )}
                                                value={values.email}
                                                onBlur={handleBlur('email')}
                                                onChangeText={handleChange(
                                                    'email',
                                                )}
                                                keyboardType="email-address"
                                            />
                                        </View>
                                        {errors.email && touched.email && (
                                            <Text className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                {errors.email}
                                            </Text>
                                        )}
                                    </View>

                                    <View className="mt-6">
                                        <Text className={LabelStyle}>
                                            Insira seu celular
                                        </Text>
                                        <View className="">
                                            <TextInput
                                                className={InputStyle(
                                                    touched.celular,
                                                    errors.celular,
                                                )}
                                                value={maskCelular(values.celular)}
                                                maxLength={16}
                                                onBlur={handleBlur('celular')}
                                                onChangeText={handleChange(
                                                    'celular',
                                                )}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        {errors.celular && touched.celular && (
                                            <Text className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                {errors.celular}
                                            </Text>
                                        )}
                                    </View>

                                    <View className="mt-6">
                                        <Text className={LabelStyle}>
                                            Insira sua nova senha
                                        </Text>
                                        <View className="relative">
                                            <TextInput
                                                className={InputStyle(
                                                    touched.senha,
                                                    errors.senha,
                                                )}
                                                value={values.senha}
                                                onBlur={handleBlur('senha')}
                                                onChangeText={handleChange(
                                                    'senha',
                                                )}
                                                keyboardType="numeric"
                                                secureTextEntry={
                                                    showPassword1 ? true : false
                                                }
                                            />
                                            <View className="absolute right-2 top-4">
                                                {!showPassword1 ? (
                                                    <MaterialIcons
                                                        onPress={() =>
                                                            setShowPassword1(
                                                                !showPassword1,
                                                            )
                                                        }
                                                        name="visibility"
                                                        size={32}
                                                        color={'#858383'}
                                                    />
                                                ) : (
                                                    <MaterialIcons
                                                        onPress={() =>
                                                            setShowPassword1(
                                                                !showPassword1,
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
                                            <Text className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                {errors.senha}
                                            </Text>
                                        )}
                                    </View>

                                    <View className="mt-6">
                                        <Text className={LabelStyle}>
                                            Confirme sua nova senha
                                        </Text>
                                        <View className="relative">
                                            <TextInput
                                                className={InputStyle(
                                                    touched.repitaSenha,
                                                    errors.repitaSenha,
                                                )}
                                                value={values.repitaSenha}
                                                onBlur={handleBlur(
                                                    'repitaSenha',
                                                )}
                                                onChangeText={handleChange(
                                                    'repitaSenha',
                                                )}
                                                keyboardType="numeric"
                                                secureTextEntry={
                                                    showPassword2 ? true : false
                                                }
                                            />
                                            <View className="absolute right-2 top-4">
                                                {!showPassword2 ? (
                                                    <MaterialIcons
                                                        onPress={() =>
                                                            setShowPassword2(
                                                                !showPassword2,
                                                            )
                                                        }
                                                        name="visibility"
                                                        size={32}
                                                        color={'#858383'}
                                                    />
                                                ) : (
                                                    <MaterialIcons
                                                        onPress={() =>
                                                            setShowPassword2(
                                                                !showPassword2,
                                                            )
                                                        }
                                                        name="visibility-off"
                                                        size={32}
                                                        color={'#858383'}
                                                    />
                                                )}
                                            </View>
                                        </View>
                                        {errors.repitaSenha &&
                                            touched.repitaSenha && (
                                                <Text className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                    {errors.repitaSenha}
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

export default RegisterPassword;
