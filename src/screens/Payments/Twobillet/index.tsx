import {View, Text, Alert, TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AppLayout from '@components/AppLayout';
import AppLoading from '@components/AppLoading';
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import {AuthContext} from '@contexts/auth';
import serviceapp from '@services/serviceapp';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {RootDrawerParamList} from '@screens/RootStackPrams';
import MoneyPTBR from '@components/MoneyPTBRSimbol';
import {ListStyle} from '@components/InputStyle';
import {FlashList} from '@shopify/flash-list';

const Twobillet = () => {
    const navigation =
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    const {setLoading, loading, disconnect, user} = useContext(AuthContext);
    const [paymentSlips, setPaymentSlips] = useState<any>([]);

    useEffect(() => {
        const getPaymentSlips = async () => {
            setLoading(true);
            await serviceapp
                .get(`(WS_SEGUNDA_VIA_BOLETO)?token=${user.token}`)
                .then(response => {
                    const {success, message, data, token} =
                        response.data.resposta;
                        setLoading(false);
                    if (!success) {
                        Alert.alert('Atenção', message);
                        return;
                    }
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
                    setPaymentSlips(data.ordem);
                })
                .catch(err => {
                    console.log(err);
                });
        };
        getPaymentSlips();
    }, []);

    const RenderItem = ({item}: any) => {
        return (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('ActionBillet', {order: item})
                }
                className={`flex-row items-center justify-between bg-solar-gray-light my-1 ${ListStyle} py-4 `}
            >
                <View className="flex-row items-center justify-between">
                    <View className="flex-col flex-1">
                        <View className="w-full flex-row items-center justify-between mb-2">
                            <Text className="text-base font-PoppinsRegular">
                                Ordem pagamento{' '}
                            </Text>
                            <Text className="text-xl font-PoppinsBold text-solar-blue-dark">
                                {MoneyPTBR(parseFloat(item.valorOrdem))}
                            </Text>
                        </View>
                        <View className="w-full flex-row items-center justify-between">
                            <Text className="text-base font-PoppinsMedium">
                                {item.numeroOrdem}
                            </Text>
                            <Text className="text-base font-PoppinsRegular">
                                {item.dataEmissao}
                            </Text>
                        </View>
                    </View>
                    <View className="w-10 items-end">
                        <MaterialIcons
                            name="arrow-forward-ios"
                            color={'#FAA335'}
                            size={26}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <AppLayout>
            <AppLoading visible={loading} />
            <View className="flex-1 bg-solar-gray-dark px-4">
                <View className="pt-4 flex items-center border-b border-b-gray-300">
                    <Text className="text-2xl text-solar-blue-dark font-PoppinsMedium">
                        Segunda via boletos
                    </Text>

                    <View className="flex-row items-center justify-center w-full pb-6 pt-2">
                        <MaterialCommunityIcons
                            name="barcode"
                            size={60}
                            color={'#154295'}
                        />
                    </View>
                </View>
                {paymentSlips.length > 0 ? (
                    <View className="flex-1 w-full h-full pb-2">
                        <FlashList
                            data={paymentSlips}
                            renderItem={({item}: any) => (
                                <RenderItem item={item} />
                            )}
                            estimatedItemSize={10}
                            keyboardShouldPersistTaps={'always'}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                ) : (
                    <View className="flex-col items-center justify-center">
                        <Text className="text-base font-PoppinsBold text-solar-blue-dark px-3 py-4 text-center">
                            Não existem boletos disponíveis para 2ª via
                        </Text>
                    </View>
                )}
            </View>
        </AppLayout>
    );
};

export default Twobillet;
