import {View, Text, TouchableOpacity, Share, Platform} from 'react-native';
import React from 'react';
import AppLayout from '@components/AppLayout';
import {MaterialIcons} from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-tiny-toast';
import * as WebBrowser from 'expo-web-browser';
import {ListStyle} from '@components/InputStyle';
import MoneyPTBR from '@components/MoneyPTBRSimbol';

const ActionBillet = ({route}: any) => {
    const {order} = route?.params;

    const Amount = order.valorOrdem;
    const url = order.urlBoleto;

    const sharingUrl = async () => {
        try {
            const result = await Share.share({
                message: url,
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
        Clipboard.setStringAsync(url);
        Toast.show('Link copiado para a área de transferência!', {
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

    let colorBar = Platform.OS === 'ios' ? 'rgba(0, 162, 227, 0)' : '#009FE3';
    const handleSlipBrowser = async () => {
        await WebBrowser.openBrowserAsync(url, {
            toolbarColor: colorBar,
            controlsColor: '#FFF',
        });
    };

    return (
        <AppLayout>
            <View className="flex-1 items-center justify-start bg-solar-gray-dark px-4">
                <View className="flex-col items-center justify-center">
                    <Text className="text-3xl text-solar-blue-dark py-4">
                        Pagamento
                    </Text>
                    <Text className="text-base text-solar-blue-dark font-PoppinsRegular mb-4 px-8 text-center">
                        Boleto bancário
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
                                {MoneyPTBR(parseFloat(Amount))}
                            </Text>
                            <Text className="text-lg font-PoppinsRegular text-solar-blue-dark my-3">
                                Boleto gerado via url
                            </Text>
                            <Text className="text-lg font-PoppinsBold text-solar-blue-dark my-3">
                                (selecionar opção abaixo)
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
                                Copiar link
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
                                Compartilhar Link
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSlipBrowser}>
                        <View className="flex-row items-center border-b-2 border-b-gray-300 py-4 pl-10">
                            <MaterialIcons
                                name="launch"
                                size={26}
                                color={'#154295'}
                            />
                            <Text className="text-lg text-solar-blue-dark font-PoppinsRegular ml-6">
                                Vizualizar boleto
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </AppLayout>
    );
};

export default ActionBillet;
