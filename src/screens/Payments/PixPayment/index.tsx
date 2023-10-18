import { View, Text, Alert, Share, TouchableOpacity } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import serviceapp from '@services/serviceapp';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '@screens/RootStackPrams';
import { AuthContext } from '@contexts/auth';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-tiny-toast';
import QRCode from 'react-native-qrcode-svg';
import AppLayout from '@components/AppLayout';
import { ListStyle } from '@components/InputStyle';
import { MaterialIcons } from '@expo/vector-icons';
import MoneyPTBR from '@components/MoneyPTBRSimbol';

const PixPayment = ({ route }: any) => {
    const navigation =
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    const { user, disconnect, setLoading, loading } = useContext(AuthContext);
    const { order } = route?.params;
    const [registeredOrder, setRegisteredOrder] = useState<any>([]);
    const [qrPix, setQrPix] = useState();

    useEffect(() => {
        const getPaymentOrder = async () => {
            setLoading(true);
            if (registeredOrder.length === 0) {
                const response = await serviceapp.post('(WS_ORDEM_PAGAMENTO)', {
                    token: user.token,
                    valor: order.valueTotal,
                    parcela: order.dataOrder,
                    tipoPagamento: 4,
                    validaDados: 'S',
                    dadosCartao: {
                        numeroCartao: '',
                        nomeCartao: '',
                        validadeCartao: '',
                        cvvCartao: '',
                    },
                });
                const { success, message, token, data } = response.data.resposta;
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
                    setLoading(false);
                    Alert.alert('Atenção', message, [{ text: 'Ok' }]);
                    return;
                }
                paymentPix(data);
            } else {
                paymentPix(registeredOrder);
            }
        };
        getPaymentOrder();
    }, [order, user]);

    const paymentPix = useCallback(
        async (dataPix: any) => {
            const response = await serviceapp.get(
                `(WS_TRANSACAO_PIX)?token=${user.token}&tempoPix=3600&valorPix=${dataPix.valorOrdem}&mensagemPix=Pagamento Pix Grupo Solar`,
            );

            const { success, message, txid, banco, copiaColaPix } = response.data.resposta;

            setLoading(false);
            if (!success) {
                Alert.alert('Atenção', message, [{ text: 'Ok' }]);
                return;
            }
            let dataPay = {
                idTransacao: txid,
                urlBoleto: banco,
            };
            sendOrderAtualize(dataPix, dataPay);
            setQrPix(copiaColaPix);
        },
        [user, order],
    );

    const sharingUrl = async () => {
        try {
            const result = await Share.share({
                message: `${qrPix}`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    const fetchCopiedUrl = async () => {
        Clipboard.setStringAsync(`${qrPix}`);
        Toast.show('QRCode copiado para a área de transferência!', {
            containerStyle: {
                backgroundColor: '#00AEEF',
                borderRadius: 15,
            },
            textStyle: {
                color: '#fff',
            },
            imgStyle: {},
            mask: false,
            maskStyle: {},
            duration: 2000,
            animation: true,
        });
    };

    const sendOrderAtualize = async (dataPix: any, dataPay: any) => {
        setRegisteredOrder([]);
        let orderResponse = {
            numeroOrdem: dataPix.numeroOrdem,
            statusOrdem: 12,
            idTransacao: dataPay.idTransacao,
            tipoPagamento: 4,
            urlBoleto: String(dataPay.urlBoleto),
        };

        await serviceapp.get(
            `(WS_ATUALIZA_ORDEM)?token=91362590064312210014616&numeroOrdem=${orderResponse.numeroOrdem}&statusOrdem=${orderResponse.statusOrdem}&idTransacao=${orderResponse.idTransacao}&tipoPagamento=${orderResponse.tipoPagamento}&urlBoleto=${orderResponse.urlBoleto}`,
        );
    };

    return (
        <AppLayout>
            <View className="flex-1 items-center justify-start bg-solar-gray-dark px-4">
                <View className="flex-col items-center justify-center">
                    <Text className="text-3xl text-solar-blue-dark py-4">
                        Pagamento
                    </Text>
                    <Text className="text-base text-solar-blue-dark font-PoppinsRegular mb-4 px-8 text-center">
                        Detalhes do pagamento PIX
                    </Text>
                </View>
                <View className="flex-col">
                    <View
                        className={`flex-row bg-solar-gray-middle border border-solar-gray-light rounded-lg p-4 mb-4  ${ListStyle}`}
                    >
                        <View
                            className={`flex-col items-center justify-center w-full`}
                        >
                            <Text className="text-4xl font-PoppinsMedium text-solar-blue-dark">
                                {MoneyPTBR(
                                    parseFloat(
                                        order.valueTotal
                                            ? order.valueTotal
                                            : order,
                                    ),
                                )}
                            </Text>
                            <Text className="text-lg font-PoppinsRegular text-solar-blue-dark mb-3">
                                Validade do Qrcode 1h(uma hora)
                            </Text>
                            <View>
                                {qrPix && (
                                    <QRCode
                                        value={qrPix}
                                        size={130}
                                        logoBackgroundColor="transparent"
                                    />
                                )}
                            </View>
                            <Text className="text-sm font-Poppins_400Regular text-solar-blue-light text-center py-4">
                                Use o Leitor de QR Code para fazer a transação
                                ou escolha uma opção abaixo
                            </Text>
                        </View>
                    </View>
                </View>
                <View className="flex-col itens-center justify-start mt-8 w-full">
                    <TouchableOpacity onPress={fetchCopiedUrl}>
                        <View className="flex-row items-center pb-4 pl-10">
                            <MaterialIcons
                                name="file-copy"
                                size={26}
                                color={'#154295'}
                            />
                            <Text className="text-lg text-solar-blue-dark font-PoppinsRegular ml-6">
                                PIX copia e cola
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={sharingUrl}>
                        <View className="flex-row items-center py-4 border-y-2 border-y-gray-300 pl-10">
                            <MaterialIcons
                                name="send"
                                size={26}
                                color={'#154295'}
                            />
                            <Text className="text-lg text-solar-blue-dark font-PoppinsRegular ml-6">
                                Compartilhar PIX
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </AppLayout>
    );
};

export default PixPayment;
