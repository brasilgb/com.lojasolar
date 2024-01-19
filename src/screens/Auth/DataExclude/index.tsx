import AppLayout from '@components/AppLayout';
import AppLoading from '@components/AppLoading';
import {AuthContext} from '@contexts/auth';
import React, {useContext} from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
} from 'react-native';
import ButtomForm from '@components/ButtomForm';
import {InputStyle, LabelStyle} from '@components/InputStyle';
import {Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {RootDrawerParamList} from '@screens/RootDrawerPrams';
import {maskCelular} from '@components/masks';

interface FormProps {
    motivo: string;
    emailCliente: string;
    celularCliente: string;
}

const DataExclude = ({route}: any) => {
    const navigation =
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    const {loading} = useContext(AuthContext);
    const {data} = route.params;

    const onsubmit = async (values: FormProps, {resetForm}: any) => {
        resetForm();
        navigation.navigate('DataAnalise', {email: values.emailCliente});
    };

    return (
        <AppLayout classname="bg-solar-gray-dark">
            <AppLoading visible={loading} />

            <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={75}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className=" px-4">
                        <View className="py-4 flex items-center border-b border-b-gray-300">
                            <Text allowFontScaling={false} className="text-2xl text-solar-blue-dark font-PoppinsMedium mb-4">
                                Exclusão de Dados
                            </Text>
                            <Text allowFontScaling={false} className="text-base text-solar-blue-dark font-PoppinsRegular mb-4">
                                Preencha o formulário abaixo corretamente para
                                iniciarmos o processo de exclusão de dados.
                            </Text>
                        </View>

                        <Formik
                            validationSchema={''}
                            initialValues={{
                                motivo: '',
                                emailCliente: data?.emailCliente,
                                celularCliente: maskCelular(
                                    data?.celularCliente,
                                ),
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
                                        <Text allowFontScaling={false} className={LabelStyle}>
                                            Qual o motivo?
                                        </Text>
                                        <TextInput
                                            className={`${InputStyle(
                                                touched.motivo,
                                                errors.motivo,
                                            )} h-24`}
                                            value={values.motivo}
                                            onBlur={handleBlur('motivo')}
                                            onChangeText={handleChange(
                                                'motivo',
                                            )}
                                            multiline
                                        />
                                        {errors.motivo && touched.motivo && (
                                            <Text allowFontScaling={false} className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                {errors.motivo}
                                            </Text>
                                        )}
                                    </View>

                                    <View className="mt-6">
                                        <Text allowFontScaling={false} className={LabelStyle}>
                                            E-mail
                                        </Text>
                                        <TextInput
                                            className={InputStyle(
                                                touched.emailCliente,
                                                errors.emailCliente,
                                            )}
                                            autoCapitalize="characters"
                                            value={values.emailCliente}
                                            onBlur={handleBlur('emailCliente')}
                                            onChangeText={handleChange(
                                                'emailCliente',
                                            )}
                                        />
                                        {errors.emailCliente &&
                                            touched.emailCliente && (
                                                <Text allowFontScaling={false} className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                    {errors.emailCliente}
                                                </Text>
                                            )}
                                    </View>

                                    <View className="mt-6">
                                        <Text allowFontScaling={false} className={LabelStyle}>
                                            Celular
                                        </Text>
                                        <TextInput
                                            className={InputStyle(
                                                touched.celularCliente,
                                                errors.celularCliente,
                                            )}
                                            autoCapitalize="characters"
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
                                                <Text allowFontScaling={false} className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                    {errors.celularCliente}
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

export default DataExclude;
