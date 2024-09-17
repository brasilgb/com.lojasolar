import {View, Text, Alert, TouchableOpacity, Image} from 'react-native';
import React, {useCallback, useContext, useState} from 'react';
import AppLayout from '@components/AppLayout';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {RootDrawerParamList} from '@screens/RootDrawerPrams';
import {AuthContext} from '@contexts/auth';
import serviceapp from '@services/serviceapp';
import moment from 'moment';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {ListStyle} from '@components/InputStyle';
import MoneyPTBR from '@components/MoneyPTBRSimbol';
import servicepay from '@services/servicepay';

const Methods = ({route}: any) => {
    const {user, disconnect} = useContext(AuthContext);
    const [registeredOrder, setRegisteredOrder] = useState<any>([]);

    const navigation =
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    const {order} = route?.params;

    const sendPaymentOrder = useCallback(async () => {
        if (registeredOrder.length === 0) {
            const response = await serviceapp.post('(WS_ORDEM_PAGAMENTO)', {
                token: user?.token,
                valor: order.valueTotal,
                parcela: order.dataOrder,
                tipoPagamento: 1,
                validaDados: 'S',
                dadosCartao: {
                    numeroCartao: '',
                    nomeCartao: '',
                    validadeCartao: '',
                    cvvCartao: '',
                },
            });
            const {success, message, token, data} = response.data.resposta;
            setRegisteredOrder(data);
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
                Alert.alert('Atenção', message, [{text: 'Ok'}]);
                return;
            }
            Alert.alert(
                'Gerar boleto?',
                'Quer realmente gerar um boleto para pagamento?',
                [
                    {
                        text: 'Não',
                        style: 'cancel',
                    },
                    {text: 'Sim', onPress: () => paymentBillet(data)},
                ],
            );
        } else {
            await paymentBillet(registeredOrder);
        }
    }, []);

    const paymentBillet = useCallback(async (dataSlip: any) => {
        const response = await servicepay.post(`/Bankslip/Create`, {
            amount: Number(dataSlip.valorOrdem),
            ordernumber: dataSlip.numeroOrdem,
            customer: {
                identity: dataSlip.cpfcnpj,
                email: dataSlip.emailCliente,
                BirthDate: moment(dataSlip.nascimento).format('YYYY-MM-DD'),
                Address: {
                    Complement: '',
                    ZipCode: dataSlip.cepCliente,
                    Country: 'BRASIL',
                    City: dataSlip.cidadeCliente,
                    State: dataSlip.ufCliente,
                    District: dataSlip.bairroCliente,
                    Street: dataSlip.enderecoCliente,
                    Number: dataSlip.numeroCliente,
                },
                Name: dataSlip.nomeCliente,
            },
            PaymentObject: {},
        });
        const {data} = response.data.resposta;
        sendOrderAtualize(data);
        setRegisteredOrder([]);
        navigation.navigate('SlipPayment', {order: data});
    }, []);

    const sendOrderAtualize = useCallback(async (dataSlip: any) => {
        let orderResponse = {
            numeroOrdem: dataSlip.Detail.OrderNumber,
            statusOrdem: dataSlip.Detail.TransactionStatus,
            idTransacao: dataSlip.Detail.IdTransaction,
            tipoPagamento: dataSlip.Detail.PaymentType,
            urlBoleto: dataSlip.Detail.PaymentObject.Url,
        };
        await serviceapp.get(
            `(WS_ATUALIZA_ORDEM)?token=${user?.token}&numeroOrdem=${orderResponse.numeroOrdem}&statusOrdem=${orderResponse.statusOrdem}&idTransacao=${orderResponse.idTransacao}&tipoPagamento=${orderResponse.tipoPagamento}&urlBoleto=${orderResponse.urlBoleto}`,
        );
    }, []);

    const pixPaymentOrder = async () => {
        const response = await serviceapp.post('(WS_ORDEM_PAGAMENTO)', {
            token: user?.token,
            valor: order?.valueTotal,
            parcela: order?.dataOrder,
            tipoPagamento: 4,
            validaDados: 'S',
            dadosCartao: {
                numeroCartao: '',
                nomeCartao: '',
                validadeCartao: '',
                cvvCartao: '',
            },
        });
        const {success, message, token, data} = response.data.resposta;

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
        if (success) {
            navigation.navigate('PixPayment', {order: data});
        } else {
            return;
        }
    };

    return (
        <AppLayout>
            <View className="flex-1 items-center justify-start bg-solar-gray-dark px-4">
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
                        Escolha sua forma de pagamento
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
                                className="text-lg font-PoppinsRegular text-solar-blue-dark"
                            >
                                Valor total do pagamento{' '}
                            </Text>
                            <Text
                                allowFontScaling={false}
                                className="text-4xl font-PoppinsMedium text-solar-blue-dark mt-8 mb-2"
                            >
                                {MoneyPTBR(
                                    parseFloat(
                                        order.valueTotal
                                            ? order.valueTotal
                                            : order,
                                    ),
                                )}
                            </Text>
                        </View>
                    </View>
                </View>
                <View className="flex-col itens-center justify-start mt-8">
                    <TouchableOpacity onPress={() => pixPaymentOrder()}>
                        <View className="flex-row items-center pb-4 pl-10">
                            <Image
                                source={require('@assets/images/pix.png')}
                                className="w-6 h-6"
                            />
                            <Text
                                allowFontScaling={false}
                                className="text-lg text-solar-blue-dark font-PoppinsRegular ml-6"
                            >
                                Pagar com PIX
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => sendPaymentOrder()}>
                        <View className="flex-row items-center py-4 border-y-2 border-y-gray-300 pl-10">
                            <MaterialCommunityIcons
                                name="barcode"
                                size={26}
                                color={'#0d3b85'}
                            />
                            <Text
                                allowFontScaling={false}
                                className="text-lg text-solar-blue-dark font-PoppinsRegular ml-6"
                            >
                                Pagar com boleto
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('CartPayment', {order: order})
                        }
                    >
                        <View className="flex-row items-center pt-4 pl-10">
                            <MaterialCommunityIcons
                                name="credit-card"
                                size={26}
                                color={'#0d3b85'}
                            />
                            <Text
                                allowFontScaling={false}
                                className="text-lg text-solar-blue-dark font-PoppinsRegular ml-6"
                            >
                                Pagar com cartão de crédito
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </AppLayout>
    );
};

export default Methods;
