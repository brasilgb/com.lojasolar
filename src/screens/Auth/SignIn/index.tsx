import {View, Text, Keyboard, TextInput} from 'react-native';
import React, {useContext} from 'react';
import AppLayout from '@components/AppLayout';
import {Formik} from 'formik';
import schema from './schema';
import {AuthContext} from '@contexts/auth';
import {cnpj, cpf} from 'cpf-cnpj-validator';
import {InputStyle, LabelStyle} from '@components/InputStyle';
import ButtomForm from '@components/ButtomForm';
import AppLoading from '@components/AppLoading';

interface ValuesForm {
    cpfcnpj: string;
}

const SignIn = () => {
    const {signIn, loading} = useContext(AuthContext);

    const formatCpfCnpj = (num: string) => {
        if (num.length < 12) {
            return cpf.format(num);
        }
        if (num.length > 11) {
            return cnpj.format(num);
        }
    };

    return (
        <AppLayout>
            <AppLoading visible={loading} />
            <View className="flex-1 items-center justify-start bg-solar-gray-dark px-4">
                <View className="flex-col items-center justify-center">
                    <Text className="text-3xl text-solar-blue-dark py-4">
                        Para continuar o acesso
                    </Text>
                    <Text className="text-base text-solar-blue-dark py-2">
                        Informe seu CPF ou CNPJ
                    </Text>
                </View>
                <Formik
                    validationSchema={schema}
                    initialValues={{
                        cpfcnpj: '',
                    }}
                    enableReinitialize={true}
                    onSubmit={(values: ValuesForm, {resetForm}: any) => {
                        Keyboard.dismiss();
                        signIn({cpfcnpj: values.cpfcnpj, resetForm: resetForm});
                    }}
                >
                    {({
                        values,
                        handleChange,
                        errors,
                        handleBlur,
                        touched,
                        isValid,
                        handleSubmit,
                    }) => (
                        <View className="h-1/2 w-full mt-10">
                            <View className="mt-6">
                                <Text className={LabelStyle}>CPF ou CNPJ</Text>
                                <TextInput
                                    className={InputStyle(
                                        touched.cpfcnpj,
                                        errors.cpfcnpj,
                                    )}
                                    value={formatCpfCnpj(values.cpfcnpj)}
                                    onBlur={handleBlur('cpfcnpj')}
                                    onChangeText={handleChange('cpfcnpj')}
                                    keyboardType="numeric"
                                />
                                {errors.cpfcnpj && touched.cpfcnpj && (
                                    <Text className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                        {errors.cpfcnpj}
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
        </AppLayout>
    );
};

export default SignIn;
