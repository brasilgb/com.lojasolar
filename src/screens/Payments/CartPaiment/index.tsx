import {
    View,
    Text,
    Alert,
    Keyboard,
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';
import React, {useContext, useState} from 'react';
import AppLayout from '@components/AppLayout';
import MoneyPTBR from '@components/MoneyPTBRSimbol';
import {AuthContext} from '@contexts/auth';
import {InputStyle, LabelStyle, ListStyle} from '@components/InputStyle';
import serviceapp from '@services/serviceapp';
import servicepay from '@services/servicepay';
import moment from 'moment';
import {cartNumber, cartValidate} from '@components/masks';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {RootDrawerParamList} from '@screens/RootDrawerPrams';
import AppLoading from '@components/AppLoading';
import {Formik} from 'formik';
import schema from './schema';
import ButtomForm from '@components/ButtomForm';

interface CartProps {
    numeroCartao: string;
    nomeCartao: string;
    validadeCartao: string;
    cvvCartao: string;
}

const CartPayment = ({route}: any) => {
    const navigation =
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    const {user, disconnect, setLoading, loading} = useContext(AuthContext);
    const {order} = route?.params;
    const [registeredOrder, setRegisteredOrder] = useState<any>([]);

    const onSubmit = async (values: CartProps) => {
        // Keyboard.dismiss();
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
            const {success, message, token, data} = response.data.resposta;
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
                Alert.alert('Atenção deu erro', message, [{text: 'Ok'}]);
                return;
            }
            await paymentCart(data);
        } else {
            await paymentCart(registeredOrder);
        }
    };

    const paymentCart = async (dataCart: any) => {
        setLoading(true);
        setRegisteredOrder(dataCart);
        const response = await servicepay.post(`/Credit/Create`, {
            OrderNumber: dataCart.numeroOrdem,
            Amount: Number(dataCart.valorOrdem),
            PaymentObject: {
                Holder: dataCart.dadosCartao.nomeCartao,
                CardNumber: dataCart.dadosCartao.numeroCartao,
                ExpirationDate: dataCart.dadosCartao.validadeCartao,
                SecurityCode: dataCart.dadosCartao.cvvCartao,
                Installments: 1,
            },
            Customer: {
                Name: dataCart.nomeCliente,
                Identity: dataCart.cpfcnpj,
                Birthdate: moment(dataCart.nascimento).format('YYYY-MM-DD'),
                Email: dataCart.emailCliente,
                Address: {
                    Complement: '',
                    ZipCode: dataCart.cepCliente,
                    Country: 'BRASIL',
                    City: dataCart.cidadeCliente,
                    State: dataCart.ufCliente,
                    District: dataCart.bairroCliente,
                    Street: dataCart.enderecoCliente,
                    Number: dataCart.numeroCliente,
                },
            },
        });
        const {success} = response.data.resposta;
        const {Description, Error} = response.data.resposta.data.Detail;
        setLoading(false);
        if (!success) {
            Alert.alert(Description, Error, [{text: 'Ok'}]);
            return;
        }
        await sendOrderAtualize(response);
    };

    const sendOrderAtualize = async (dataCart: any) => {
        setLoading(true);
        if (dataCart) {
            let orderResponse = {
                numeroOrdem: dataCart.data.resposta.data.Detail.OrderNumber,
                statusOrdem:
                    dataCart.data.resposta.data.Detail.TransactionStatus,
                idTransacao: dataCart.data.resposta.data.Detail.IdTransaction,
                tipoPagamento: dataCart.data.resposta.data.Detail.PaymentType,
                urlBoleto: '',
            };
            await serviceapp
                .get(
                    `(WS_ATUALIZA_ORDEM)?token=91362590064312210014616&numeroOrdem=${orderResponse.numeroOrdem}&statusOrdem=${orderResponse.statusOrdem}&idTransacao=${orderResponse.idTransacao}&tipoPagamento=${orderResponse.tipoPagamento}&urlBoleto=${orderResponse.urlBoleto}`,
                )
                .then(response => {
                    const {success} = response.data.resposta;
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
                            <Text className="text-3xl text-solar-blue-dark py-4">
                                Pagamento
                            </Text>
                            <Text className="text-base text-solar-blue-dark font-PoppinsRegular mb-4 px-8 text-center">
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
                                    <Text className="text-lg font-PoppinsRegular text-solar-blue-dark mb-3">
                                        Valor total do pagamento
                                    </Text>
                                    <Text className="text-4xl font-PoppinsMedium text-solar-blue-dark">
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
                                            <Text className={LabelStyle}>
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
                                                    <Text className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                        {errors.numeroCartao}
                                                    </Text>
                                                )}
                                        </View>
                                        <View className="mt-6">
                                            <Text className={LabelStyle}>
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
                                                    <Text className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                        {errors.nomeCartao}
                                                    </Text>
                                                )}
                                        </View>

                                        <View className="flex-row items-start justify-start mt-6">
                                            <View className="mr-2 flex-1">
                                                <Text className={LabelStyle}>
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
                                                    maxLength={5}
                                                />
                                                {errors.validadeCartao &&
                                                    touched.validadeCartao && (
                                                        <Text className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                            {
                                                                errors.validadeCartao
                                                            }
                                                        </Text>
                                                    )}
                                            </View>
                                            <View className="ml-2 flex-1">
                                                <Text className={LabelStyle}>
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
                                                />
                                                {errors.cvvCartao &&
                                                    touched.cvvCartao && (
                                                        <Text className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
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
