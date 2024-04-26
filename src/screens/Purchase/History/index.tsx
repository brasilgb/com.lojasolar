import {
    View,
    Text,
    Alert,
    Image,
    TouchableOpacity,
    Platform,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import AppLayout from '@components/AppLayout';
import AppLoading from '@components/AppLoading';
import {AuthContext} from '@contexts/auth';
import serviceapp from '@services/serviceapp';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {RootDrawerParamList} from '@screens/RootDrawerPrams';
import {ListStyle} from '@components/InputStyle';
import {FlashList} from '@shopify/flash-list';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import MonthPicker from 'react-native-month-year-picker';
import moment from 'moment';
import {MaterialCommunityIcons} from '@expo/vector-icons';

const History = () => {
    const navigation =
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    const {user, setLoading, loading, disconnect} = useContext(AuthContext);
    const [historicos, setHistoricos] = useState<any>([]);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const showPicker = useCallback((value: any) => setShow(value), []);
    const isFocused = useIsFocused();

    const onValueChange = useCallback(
        (event: any, newDate: any) => {
            const selectedDate = newDate || date;

            showPicker(false);
            setDate(selectedDate);
        },
        [date, showPicker],
    );

    useEffect(() => {
        const getHistoricos = async () => {
            setLoading(true);
            await serviceapp
                .get(
                    `(WS_HISTORICO_COMPRAS)?token=${user?.token}&dataInicial=${moment(
                        date,
                    ).format('YYYYMM')}01&dataFinal=${moment(date).format(
                        'YYYYMM',
                    )}31`,
                )
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
                    setHistoricos(data);
                })
                .catch(err => {
                    console.log(err);
                });
        };
        if (isFocused) {
            getHistoricos();
        }
    }, [date]);

    const RenderItem = ({item}: any) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('HistoryItem', {data: item})}
                className={`flex-row items-center justify-between bg-solar-gray-light my-1 ${ListStyle}`}
            >
                <View className="p-2 w-full">
                    <View className="flex-row mb-1">
                        <Text allowFontScaling={false} className="w-28 text-lg font-PoppinsRegular">
                            Nota fiscal:
                        </Text>
                        <Text allowFontScaling={false} className="text-lg font-PoppinsBold">
                            {item.numero}
                        </Text>
                    </View>

                    <View className="flex-row mb-1">
                        <View className="flex-row w-28">
                            <Text allowFontScaling={false} className="text-lg font-PoppinsRegular">
                                Série:
                            </Text>
                            <Text allowFontScaling={false} className="text-lg font-PoppinsBold">
                                {item.serie}
                            </Text>
                        </View>
                        <View className="flex-row">
                            <Text allowFontScaling={false} className="text-lg font-PoppinsRegular">
                                Filial:
                            </Text>
                            <Text allowFontScaling={false} className="text-lg font-PoppinsBold">
                                {item.filial}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-between w-full">
                        <Text allowFontScaling={false} className="text-xl font-PoppinsRegular">
                            Data: {item.data}
                        </Text>
                        <Text allowFontScaling={false} className="text-2xl font-PoppinsBold text-solar-blue-dark">
                            {item.valor}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <AppLayout>
            {show && (
                <MonthPicker
                    onChange={onValueChange}
                    value={date}
                    maximumDate={new Date()}
                    locale="pt"
                    okButton="Ok"
                    cancelButton="Cancelar"
                />
            )}
            <AppLoading visible={loading} />
            <View className="flex-1 items-center justify-start bg-solar-gray-dark px-4">
                <View className="flex-col items-center justify-center">
                    <Text allowFontScaling={false} className="text-3xl text-solar-blue-dark py-4">
                        Histórico de compras
                    </Text>
                    <TouchableOpacity
                        onPress={() => showPicker(true)}
                        className={`w-48 mb-6 flex-row items-center justify-between bg-solar-gray-dark border-2 border-white rounded-lg py-2 pl-2 shadow-sm ${
                            Platform.OS === 'ios'
                                ? 'shadow-gray-300'
                                : 'shadow-gray-400'
                        }`}
                    >
                        <Text allowFontScaling={false} className="flex-1 text-lg text-center text-solar-blue-dark font-PoppinsMedium">
                            {moment(date).format('MM/YYYY')}
                        </Text>
                        <MaterialCommunityIcons
                            name="calendar-month"
                            size={32}
                            color="#F99F1E"
                        />
                    </TouchableOpacity>

                    {historicos.length === 0 && (
                        <>
                            <Text allowFontScaling={false} className="text-base text-solar-blue-dark font-PoppinsRegular mb-4 px-8 text-center">
                                Você não possui nenhum histórico de compras no
                                momento
                            </Text>
                            <Image
                                source={require('@assets/images/girl_background.png')}
                            />
                        </>
                    )}
                </View>

                <View className="flex-1 w-full h-full pb-2">
                    <FlashList
                        data={historicos}
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

export default History;
