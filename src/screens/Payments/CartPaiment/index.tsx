import {
    View,
    Text,
    Alert,
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';
import React, { useContext, useState } from 'react';
import AppLayout from '@components/AppLayout';
import MoneyPTBR from '@components/MoneyPTBRSimbol';
import { AuthContext } from '@contexts/auth';
import { InputStyle, LabelStyle, ListStyle } from '@components/InputStyle';
import serviceapp from '@services/serviceapp';
import { cartNumber, cartValidate, unMask } from '@components/masks';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '@screens/RootDrawerPrams';
import AppLoading from '@components/AppLoading';
import { Formik } from 'formik';
import schema from './schema';
import ButtomForm from '@components/ButtomForm';
import servicecart from '@services/servicecart';
import { getCardBrandName } from 'src/lib/creditcart';

interface CartProps {
    numeroCartao: string;
    nomeCartao: string;
    validadeCartao: string;
    cvvCartao: string;
}

const CartPayment = ({ route }: any) => {
    const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    const { user, disconnect, setLoading, loading } = useContext(AuthContext);
    const { order } = route?.params;
    const [registeredOrder, setRegisteredOrder] = useState<any>([]);

    const onSubmit = async (values: CartProps, { resetForm }: any) => {
        setLoading(true);
        if (registeredOrder.length === 0) {
            const response = await serviceapp.post('(WS_ORDEM_PAGAMENTO)', {
                token: user?.token,
                valor: order.valuetotal,
                parcela: order.dataOrder,
                tipoPagamento: 2,
                validaDados: 'S',
                dadosCartao: {
                    numeroCartao: values.numeroCartao,
                    nomeCartao: values.nomeCartao,
                    validadeCartao: cartValidate(values.validadeCartao),
                    cvvCartao: values.cvvCartao,
                },
            });

            const { success, message, token, data } = response.data.resposta;
            setLoading(false);
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
            if (!success) {
                Alert.alert('Atenção deu erro', message, [{ text: 'Ok' }]);
                return;
            }
            setRegisteredOrder(data);
            await paymentCart(data);
        } else {
            await paymentCart(registeredOrder);
        }
    };

    const paymentCart = async (dataCart: any) => {
        const response = await servicecart.post(`(PAG_CARTAO_CREDITO)`, {
            MerchantOrderId: dataCart.numeroOrdem,
            Payment: {
                Type: "CreditCard",
                Amount: Number(dataCart.valorOrdem) * 100,
                Currency: "BRL",
                Country: "BRA",
                Provider: "Cielo",
                ServiceTaxAmount: 0,
                Installments: 1,
                Interest: "ByMerchant",
                Capture: true,
                Authenticate: false,
                Recurrent: false,
                SoftDescriptor: "123456789ABCD",
                CreditCard: {
                    CardNumber: unMask(dataCart.dadosCartao.numeroCartao),
                    Holder: dataCart.dadosCartao.nomeCartao,
                    ExpirationDate: dataCart.dadosCartao.validadeCartao,
                    SecurityCode: dataCart.dadosCartao.cvvCartao,
                    SaveCard: false,
                    Brand: getCardBrandName((dataCart.dadosCartao.numeroCartao))
                }
            }
        });
        const { success, ReturnMessage, ReturnCode, data } = response.data.response;
        // console.log('Aqui é o cartão', response.data.response);
        if (success && ReturnCode !== '00') {
            Alert.alert('Atenção', ReturnMessage, [{ text: 'Ok' }]);
        }
        // Aqui atualiza a ordem de pagamento caso de certo
        await sendOrderAtualize(response.data.response);
    }

    const sendOrderAtualize = async (dataCart: any) => {
        setLoading(true);
        if (dataCart) {
            let orderResponse = {
                numeroOrdem: dataCart.MerchantOrderId,
                statusOrdem: 2,
                idTransacao: dataCart.PaymentId,
                tipoPagamento: 2,
                urlBoleto: dataCart.AuthorizationCode,
            };
            await serviceapp
                .get(`(WS_ATUALIZA_ORDEM)?token=91362590064312210014616&numeroOrdem=${orderResponse.numeroOrdem}&statusOrdem=${orderResponse.statusOrdem}&idTransacao=${orderResponse.idTransacao}&tipoPagamento=${orderResponse.tipoPagamento}&urlBoleto=${orderResponse.urlBoleto}`)
                .then(response => {
                    const { success } = response.data.resposta;
                    setRegisteredOrder([]);
                    if (success) {
                        setLoading(false);
                        navigation.navigate('PayCartOk');
                    }
                });
        }
    };

    return (
        <AppLayout>
            <AppLoading visible={loading} />
            <View className="flex-1 items-center justify-start bg-solar-gray-dark px-4">
                <KeyboardAvoidingView
                    behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={75}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="flex-col items-center justify-center">
                            <Text
                                allowFontScaling={false}
                                className="text-3xl text-solar-blue-dark py-4"
                            >
                                Pagamento
                            </Text>
                            <Text
                                allowFontScaling={false}
                                className="text-base text-solar-blue-dark font-PoppinsRegular mb-4 px-8 text-center"
                            >
                                Cartão de crédito
                            </Text>
                        </View>
                        <View className="flex-col">
                            <View
                                className={`flex-row bg-solar-gray-middle border border-solar-gray-light rounded-lg p-4 mb-4  ${ListStyle}`}
                            >
                                <View
                                    className={`flex-col items-center justify-center w-full`}
                                >
                                    <Text
                                        allowFontScaling={false}
                                        className="text-lg font-PoppinsRegular text-solar-blue-dark mb-3"
                                    >
                                        Valor total do pagamento
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        className="text-4xl font-PoppinsMedium text-solar-blue-dark"
                                    >
                                        {MoneyPTBR(
                                            parseFloat(order.valueTotal),
                                        )}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View className="flex-col itens-center justify-start mt-8 w-full">
                            <Formik
                                validationSchema={schema}
                                initialValues={{
                                    numeroCartao: '',
                                    nomeCartao: '',
                                    validadeCartao: '',
                                    cvvCartao: '',
                                }}
                                onSubmit={onSubmit}
                            >
                                {({
                                    handleChange,
                                    handleBlur,
                                    setValues,
                                    setFieldValue,
                                    handleSubmit,
                                    setFieldTouched,
                                    values,
                                    touched,
                                    errors,
                                    isValid,
                                }) => (
                                    <View>
                                        <View>
                                            <Text
                                                allowFontScaling={false}
                                                className={LabelStyle}
                                            >
                                                Número do cartão de crédito
                                            </Text>
                                            <TextInput
                                                className={InputStyle(
                                                    touched.numeroCartao,
                                                    errors.numeroCartao,
                                                )}
                                                value={cartNumber(
                                                    values.numeroCartao,
                                                )}
                                                onBlur={handleBlur(
                                                    'numeroCartao',
                                                )}
                                                onChangeText={handleChange(
                                                    'numeroCartao',
                                                )}
                                                keyboardType="numeric"
                                                maxLength={19}
                                            />
                                            {errors.numeroCartao &&
                                                touched.numeroCartao && (
                                                    <Text
                                                        allowFontScaling={false}
                                                        className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular"
                                                    >
                                                        {errors.numeroCartao}
                                                    </Text>
                                                )}
                                        </View>
                                        <View className="mt-6">
                                            <Text
                                                allowFontScaling={false}
                                                className={LabelStyle}
                                            >
                                                Nome impresso no cartão
                                            </Text>
                                            <TextInput
                                                className={InputStyle(
                                                    touched.nomeCartao,
                                                    errors.nomeCartao,
                                                )}
                                                value={values.nomeCartao}
                                                onBlur={handleBlur(
                                                    'nomeCartao',
                                                )}
                                                onChangeText={handleChange(
                                                    'nomeCartao',
                                                )}
                                                keyboardType="default"
                                                autoCapitalize="characters"
                                            />
                                            {errors.nomeCartao &&
                                                touched.nomeCartao && (
                                                    <Text
                                                        allowFontScaling={false}
                                                        className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular"
                                                    >
                                                        {errors.nomeCartao}
                                                    </Text>
                                                )}
                                        </View>

                                        <View className="flex-row items-start justify-start mt-6">
                                            <View className="mr-2 flex-1">
                                                <Text
                                                    allowFontScaling={false}
                                                    className={LabelStyle}
                                                >
                                                    Validade
                                                </Text>
                                                <TextInput
                                                    className={InputStyle(
                                                        touched.validadeCartao,
                                                        errors.validadeCartao,
                                                    )}
                                                    value={cartValidate(
                                                        values.validadeCartao,
                                                    )}
                                                    onBlur={handleBlur(
                                                        'validadeCartao',
                                                    )}
                                                    onChangeText={handleChange(
                                                        'validadeCartao',
                                                    )}
                                                    keyboardType="numeric"
                                                    maxLength={7}
                                                />
                                                {errors.validadeCartao &&
                                                    touched.validadeCartao && (
                                                        <Text
                                                            allowFontScaling={
                                                                false
                                                            }
                                                            className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular"
                                                        >
                                                            {
                                                                errors.validadeCartao
                                                            }
                                                        </Text>
                                                    )}
                                            </View>
                                            <View className="ml-2 flex-1">
                                                <Text
                                                    allowFontScaling={false}
                                                    className={LabelStyle}
                                                >
                                                    Código CVV
                                                </Text>
                                                <TextInput
                                                    className={InputStyle(
                                                        touched.cvvCartao,
                                                        errors.cvvCartao,
                                                    )}
                                                    value={values.cvvCartao}
                                                    onBlur={handleBlur(
                                                        'cvvCartao',
                                                    )}
                                                    onChangeText={handleChange(
                                                        'cvvCartao',
                                                    )}
                                                    keyboardType="numeric"
                                                    maxLength={getCardBrandName(values.numeroCartao) === 'amex' ? 4 : 3}
                                                />
                                                {errors.cvvCartao &&
                                                    touched.cvvCartao && (
                                                        <Text
                                                            allowFontScaling={
                                                                false
                                                            }
                                                            className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular"
                                                        >
                                                            {errors.cvvCartao}
                                                        </Text>
                                                    )}
                                            </View>
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
            </View>
        </AppLayout>
    );
};

export default CartPayment;