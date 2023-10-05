import {
    View,
    Text,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    TextInput,
    Alert,
} from 'react-native';
import React, {useCallback, useContext, useState} from 'react';
import AppLayout from '@components/AppLayout';
import AppLoading from '@components/AppLoading';
import {AuthContext} from '@contexts/auth';
import {MaterialIcons} from '@expo/vector-icons';
import {Formik} from 'formik';
import {InputStyle, LabelStyle} from '@components/InputStyle';
import ButtomForm from '@components/ButtomForm';
import schema from './schema';
import serviceapp from '@services/serviceapp';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '@screens/RootStackPrams';

interface SenhaProps {
    senha: string;
    repitaSenha: string;
    senhaAnterior: string;
}

const AlterPassword = () => {
    const {setLoading, loading, disconnect, setUser, user} =
        useContext(AuthContext);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [showPassword1, setShowPassword1] = useState<boolean>(true);
    const [showPassword2, setShowPassword2] = useState<boolean>(true);
    const [showPassword3, setShowPassword3] = useState<boolean>(true);

    const onsubmit = useCallback(
        async (values: SenhaProps, {resetForm}: any) => {
            setLoading(true);
            const response = await serviceapp.get(
                `(WS_ALTERAR_SENHA_APP)?cpfcnpj=cpfcnpj=${user.cpfCnpj}&senha=${values.senha}&token=${user.token}&senhaAnterior=${values.senhaAnterior}`,
            );
            const {success, message, data, token} = response.data.resposta;
            if (!token) {
                Alert.alert('Atenção', message, [
                    {
                        text: 'Ok',
                        onPress: () => {
                            navigation.navigate('Home'), disconnect();
                        },
                    },
                ]);
            }
            let userData = {
                connected: user.connected,
                cpfCnpj: user.cpfCnpj,
                nomeCliente: user.nomeCliente,
                token: data.token,
            };
            setUser(userData);
            setLoading(false);
            resetForm();
            Alert.alert('Atenção', message, [
                {text: 'Ok', onPress: () => navigation.navigate('Home')},
            ]);
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
                            <Text className="text-2xl text-solar-blue-dark font-PoppinsMedium mb-4 pb-2 border-b border-b-gray-300 w-full text-center">
                                Alterar senha
                            </Text>

                            <View className="flex-row items-center justify-start w-full">
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
                                senha: '',
                                repitaSenha: '',
                                senhaAnterior: '',
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
                                            Insira a senha atual
                                        </Text>
                                        <View className="relative">
                                            <TextInput
                                                className={InputStyle(
                                                    touched.senhaAnterior,
                                                    errors.senhaAnterior,
                                                )}
                                                value={values.senhaAnterior}
                                                onBlur={handleBlur(
                                                    'senhaAnterior',
                                                )}
                                                onChangeText={handleChange(
                                                    'senhaAnterior',
                                                )}
                                                keyboardType="default"
                                                secureTextEntry={
                                                    showPassword1 ? true : false
                                                }
                                            />
                                            <View className="absolute right-2 top-4">
                                                {showPassword1 ? (
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
                                        {errors.senhaAnterior &&
                                            touched.senhaAnterior && (
                                                <Text className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                    {errors.senhaAnterior}
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
                                                keyboardType="default"
                                                secureTextEntry={
                                                    showPassword2 ? true : false
                                                }
                                            />
                                            <View className="absolute right-2 top-4">
                                                {showPassword2 ? (
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
                                                keyboardType="default"
                                                secureTextEntry={
                                                    showPassword3 ? true : false
                                                }
                                            />
                                            <View className="absolute right-2 top-4">
                                                {showPassword3 ? (
                                                    <MaterialIcons
                                                        onPress={() =>
                                                            setShowPassword3(
                                                                !showPassword3,
                                                            )
                                                        }
                                                        name="visibility"
                                                        size={32}
                                                        color={'#858383'}
                                                    />
                                                ) : (
                                                    <MaterialIcons
                                                        onPress={() =>
                                                            setShowPassword3(
                                                                !showPassword3,
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

export default AlterPassword;
