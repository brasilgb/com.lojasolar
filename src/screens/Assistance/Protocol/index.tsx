import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AppLayout from '@components/AppLayout';
import AppLoading from '@components/AppLoading';
import {FlashList} from '@shopify/flash-list';
import {ListStyle} from '@components/InputStyle';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {RootDrawerParamList} from '@screens/RootDrawerPrams';
import {AuthContext} from '@contexts/auth';
import serviceapp from '@services/serviceapp';
import {MaterialIcons} from '@expo/vector-icons';

const Protocols = () => {
    const navigation =
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    const {user, setLoading, loading, disconnect} = useContext(AuthContext);
    const [protocols, setProtocols] = useState<any>([]);

    useEffect(() => {
        const getProtocols = async () => {
            setLoading(true);
            await serviceapp
                .get(`(WS_PROTOCOLO_ASSISTENCIA)?token=${user?.token}`)
                .then(response => {
                    const {success, message, data} = response.data.resposta;
                    setLoading(false);
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
                    setProtocols(data);
                })
                .catch(err => {
                    console.log(err);
                });
        };
        getProtocols();
    }, []);

    const RenderItem = ({item}: any) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('Detail', {data: item})}
                className={`flex-row items-center justify-between bg-solar-gray-light my-1 ${ListStyle}`}
            >
                <View className="py-2 w-full flex-row items-center justify-between">
                    <View className="flex-col">
                        <View className="w-full flex-row m-2">
                            <Text allowFontScaling={false} className="text-xl font-PoppinsBold">
                                Protocolo:{' '}
                            </Text>
                            <Text allowFontScaling={false} className="text-xl font-PoppinsBold">
                                {item.nProtocolo}
                            </Text>
                        </View>
                        <View className="w-full m-2">
                            <Text allowFontScaling={false} className="text-xl font-Poppins_400Regular">
                                {item.produto}
                            </Text>
                        </View>
                    </View>
                    <View className="m-2">
                        <MaterialIcons
                            name="arrow-forward-ios"
                            size={30}
                            color="#F99F1E"
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <AppLayout>
            <AppLoading visible={loading} />
            <View className="flex-1 items-center justify-start bg-solar-gray-dark px-4">
                <View className="flex-col items-center justify-center">
                    <Text allowFontScaling={false} className="text-3xl text-solar-blue-dark py-4 text-center px-16">
                        Protocolo de Assistência Técnica
                    </Text>
                    {protocols.length === 0 && (
                        <>
                            <Image
                                source={require('@assets/images/icon_support_chat.png')}
                            />
                            <Text allowFontScaling={false} className="text-xl text-solar-blue-dark font-PoppinsMedium mb-4 pt-8 text-center">
                                Você não possui nenhum pedido de manutenção no
                                momento
                            </Text>
                            <Text allowFontScaling={false} className="text-sm text-solar-blue-dark font-PoppinsMedium mb-4 pt-8 text-center">
                                Caso tenha alguma dúvida entre em contato com
                                nosso SAC e teremos prazer em lhe ajudar
                            </Text>
                        </>
                    )}
                </View>

                <View className="w-full h-full flex-1 pb-2">
                    <FlashList
                        data={protocols}
                        renderItem={({item}: any) => <RenderItem item={item} />}
                        estimatedItemSize={10}
                        keyboardShouldPersistTaps={'always'}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </AppLayout>
    );
};

export default Protocols;
