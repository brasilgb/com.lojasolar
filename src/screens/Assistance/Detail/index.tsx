import {View, Text, Alert, ScrollView} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AppLoading from '@components/AppLoading';
import AppLayout from '@components/AppLayout';
import {AuthContext} from '@contexts/auth';
import serviceapp from '@services/serviceapp';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {RootDrawerParamList} from '@screens/RootStackPrams';
import {ListStyle} from '@components/InputStyle';

const Detail = ({route}: any) => {
    const {data} = route.params;
    const navigation =
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    const {user, setLoading, loading, disconnect} = useContext(AuthContext);
    const [details, setDetails] = useState<any>([]);

    useEffect(() => {
        const getDetails = async () => {
            setLoading(true);
            await serviceapp
                .get(
                    `(WS_PROTOCOLO_DETALHE)?token=${user.token}&filial=${data.filial}&nProtocolo=${data.nProtocolo}`,
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
                    setDetails(data);
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => setLoading(false));
        };
        getDetails();
    }, [data]);

    return (
        <AppLayout>
            <AppLoading visible={loading} />
            <View className="flex-1 items-center justify-start bg-solar-gray-dark px-4">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-col items-center justify-center">
                        <Text className="text-3xl text-solar-blue-dark py-4 text-center px-16">
                            Detalhes da assistência
                        </Text>
                        <Text className="text-2xl text-solar-blue-dark font-PoppinsBold py-4 text-center mt-2">
                            {data?.produto}
                        </Text>
                    </View>

                    {details.eventos && (
                        <View className="flex-col">
                            <View
                                className={`flex-row items-center justify-between bg-solar-gray-light py-2 ${ListStyle}`}
                            >
                                <View className="w-full flex-col items-start justify-start mb-2">
                                    <Text className="text-lg font-PoppinsBold">
                                        Abertura:
                                    </Text>
                                    <Text className="text-lg font-Poppins_400Regular py-1">
                                        {details.Abertura}
                                    </Text>
                                    <Text className="text-lg font-PoppinsBold">
                                        Descrição:
                                    </Text>
                                    <Text className="text-lg font-Poppins_400Regular py-1">
                                        {details.defeito}
                                    </Text>
                                    <Text className="text-lg font-PoppinsBold">
                                        Status:
                                    </Text>
                                    <Text className="text-lg font-Poppins_400Regular pt-1">
                                        {details.status}
                                    </Text>
                                </View>
                            </View>
                            <View
                                className={`flex-row items-start justify-between bg-solar-gray-light my-1 ${ListStyle} p-4 mb-4`}
                            >
                                <View className="relative border-l-2 border-gray-200 dark:border-gray-700">
                                    {details.eventos &&
                                        details.eventos.map(
                                            (e: any, i: number, row: any) => (
                                                <View
                                                    key={i}
                                                    className={`flex-col items-left ${
                                                        i + 1 === row.length
                                                            ? ''
                                                            : 'mb-8'
                                                    } ml-4`}
                                                >
                                                    <View
                                                        className={`absolute w-6 h-6 rounded-full top-0 -left-7 ${
                                                            i + 1 === row.length
                                                                ? 'bg-solar-orange-middle'
                                                                : 'bg-gray-400'
                                                        } border-2 border-solar-gray-dark`}
                                                    />
                                                    <Text className="text-sm font-PoppinsMedium text-solar-blue-dark ml-2">
                                                        {e?.xEventos}
                                                    </Text>
                                                </View>
                                            ),
                                        )}
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </View>
        </AppLayout>
    );
};
export default Detail;
