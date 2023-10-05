import {View, Text, Alert, Image} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import serviceapp from '@services/serviceapp';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {RootDrawerParamList} from '@screens/RootStackPrams';
import {AuthContext} from '@contexts/auth';
import AppLayout from '@components/AppLayout';
import MoneyPTBR from '@components/MoneyPTBRSimbol';
import AppLoading from '@components/AppLoading';
import {ListStyle} from '@components/InputStyle';

const HistoryItens = ({route}: any) => {
    const navigation =
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    const {data} = route?.params;
    const dataItem = data;
    const {user, setLoading, loading, disconnect} = useContext(AuthContext);
    const [historicoItems, setHistoricoItems] = useState<any>([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        const getHistoricoItems = async () => {
            setLoading(true);
            await serviceapp
                .get(
                    `(WS_HISTORICO_ITENS)?token=${user.token}&numero=${dataItem?.numero}&filial=${dataItem?.filial}&serie=${dataItem?.serie}`,
                )
                .then(response => {
                    const {success, message, data} = response.data.resposta;
                    if (!success) {
                        Alert.alert('Atenção', message, [
                            {
                                text: 'Ok',
                                onPress: () => {
                                    navigation.navigate('Home'), disconnect();
                                },
                            },
                        ]);
                    }
                    setHistoricoItems(data);
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => setLoading(false));
        };
        if (isFocused) {
            getHistoricoItems();
        }
    }, [user, dataItem]);

    return (
        <AppLayout>
            <AppLoading visible={loading} />
            <View className="flex-col items-center justify-start bg-solar-gray-dark px-4">
                <View className="">
                    <Text className="text-3xl text-solar-blue-dark py-4">
                        Detalhes da compra
                    </Text>
                </View>
            </View>
            <View className="flex-1 bg-solar-gray-dark pt-8 px-4">
                <View
                    className={`flex-col items-center justify-between bg-solar-gray-light my-1 ${ListStyle} py-4 px-2`}
                >
                    <View className="w-full flex-row items-center justify-between mb-2">
                        <Text className="flex-1 text-xl font-PoppinsRegular">
                            N° da compra:{' '}
                        </Text>
                        <Text className="flex-1 text-lg font-PoppinsBold text-right">
                            {data?.numero}
                        </Text>
                    </View>
                    <View className="w-full flex-row items-center justify-between">
                        <Text className="text-base font-PoppinsRegular flex-1">
                            Data: {data?.data}
                        </Text>
                        <Text className="text-xl font-PoppinsBold text-solar-blue-dark flex-1 text-right">
                            {MoneyPTBR(parseFloat(data?.valor))}
                        </Text>
                    </View>
                </View>
                {historicoItems &&
                    historicoItems.map((item: any, idx: number) => (
                        <View
                            key={idx}
                            className={`flex-row items-center justify-between bg-solar-gray-light my-1 ${ListStyle}`}
                        >
                            <View className="flex-1">
                                <Image
                                    source={{uri: item?.linkImagem}}
                                    className="h-40 w-40 rounded-l-lg"
                                />
                            </View>
                            <View className="flex-1 pl-2">
                                <Text className="text-base font-PoppinsBold">
                                    {item?.descricao}
                                </Text>
                                <Text className="text-right my-1 font-PoppinsMedium text-gray-500 py-1">
                                    {parseInt(item?.quantidade)} un x{' '}
                                    {MoneyPTBR(parseFloat(item?.unitario))}
                                </Text>
                                <Text className="text-right text-lg text-solar-blue-dark font-PoppinsBold">
                                    {MoneyPTBR(parseFloat(item?.total))}
                                </Text>
                            </View>
                        </View>
                    ))}
            </View>
        </AppLayout>
    );
};

export default HistoryItens;
