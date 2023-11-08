import {View, Text, Platform, Alert, Image, BackHandler} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AppLayout from '@components/AppLayout';
import AppLoading from '@components/AppLoading';
import ButtonPayament from '@components/ButtonPayament';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {RootDrawerParamList} from '@screens/RootDrawerPrams';
import {AuthContext} from '@contexts/auth';
import {TouchableOpacity} from 'react-native-gesture-handler';
import moment from 'moment';
import serviceapp from '@services/serviceapp';
import {FlashList} from '@shopify/flash-list';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {ListStyle} from '@components/InputStyle';
import MoneyPTBR from '@components/MoneyPTBRSimbol';
import {MaterialCommunityIcons} from '@expo/vector-icons';

const HistoryPayments = () => {
    const {loading, setLoading, user, disconnect} = useContext(AuthContext);

    const navigation =
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    const [crediarios, setCrediarios] = useState<any>([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
    const datePrev = moment().add(-1, 'days').format('DD');
    const [dateIni, setDateIni] = useState<any>(
        moment().add(-datePrev, 'days'),
    );
    const [dateFin, setDateFin] = useState<any>(new Date());

    useEffect(() => {
        const getCrediarios = async () => {
            setLoading(true);
            await serviceapp
                .get(
                    `(WS_CARREGA_CREDIARIO)?token=${user?.token}&tipo=H&dataInicial=${moment(
                        dateIni,
                    ).format('YYYYMMDD')}&dataFinal=${moment(dateFin).format(
                        'YYYYMMDD',
                    )}`,
                )
                .then(response => {
                    const {success, message, token, data} =
                        response.data.resposta;
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
                    setCrediarios(data.historico);
                })
                .catch(error => {
                    console.log(error);
                });
        };
        getCrediarios();
    }, [dateIni, dateFin]);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: any) => {
        setDateIni(date);
        hideDatePicker();
    };

    const showDatePicker2 = () => {
        setDatePickerVisibility2(true);
    };

    const hideDatePicker2 = () => {
        setDatePickerVisibility2(false);
    };

    const handleConfirm2 = (date: any) => {
        setDateFin(date);
        hideDatePicker2();
    };

    const RenderItem = ({crediario}: any) => {
        return (
            <View
                className={`flex-row items-center justify-between bg-solar-gray-light my-1 ${ListStyle} py-4 `}
            >
                <View className="flex-row items-center justify-center w-full">
                    <View className="flex-1 flex-col items-start">
                        <View className="flex-row">
                            <View className="w-3/5 pl-2">
                                <Text className="text-sm font-PoppinsRegular pb-1">
                                    Parcela da compra
                                </Text>
                                <Text className="text-lg font-PoppinsMedium">
                                    {crediario.numeroCarne}
                                </Text>
                                <Text className="text-sm font-PoppinsRegular">
                                    {crediario.pagamento}
                                </Text>
                                <Text className="text-base font-PoppinsRegular pt-1">
                                    Parcela{' '}
                                    {crediario.parcela.replace('/', ' de ')}
                                </Text>
                            </View>
                            <View className="w-2/5 flex items-center justify-between">
                                <View
                                    className={`${
                                        crediario.vPago > 0
                                            ? 'bg-solar-blue-light'
                                            : ''
                                    }  rounded-md mb-2 py-2 px-6`}
                                >
                                    <Text
                                        className={`text-base font-PoppinsRegular ${
                                            crediario.vPago > 0
                                                ? 'text-white'
                                                : 'text-solar-gray-middle'
                                        }`}
                                    >
                                        Pago
                                    </Text>
                                </View>
                                <View className="flex items-end">
                                    <Text className="text-2xl font-Poppins_700Bold mt-2 text-solar-blue-dark">
                                        {MoneyPTBR(parseFloat(crediario.vPago))}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <AppLayout>
            <AppLoading visible={loading} />

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            <DateTimePickerModal
                isVisible={isDatePickerVisible2}
                mode="date"
                onConfirm={handleConfirm2}
                onCancel={hideDatePicker2}
            />
            <View className="flex-1 items-center justify-start bg-solar-gray-dark px-4">
                <View className="flex-col items-center justify-center mb-4">
                    <Text className="text-3xl text-solar-blue-dark py-4">
                        Meus pagamentos
                    </Text>
                </View>

                <View className="flex-row items-center justify-between w-full">
                    <View className="flex-1 pr-2">
                        <ButtonPayament
                            bgclassname="bg-solar-gray-dark"
                            txcolor="text-solar-blue-dark"
                            onpress={() => navigation.navigate('OpenPayments')}
                            label={'Em aberto'}
                        />
                    </View>

                    <View className="flex-1 pl-2">
                        <ButtonPayament
                            bgclassname="bg-solar-blue-dark"
                            txcolor="text-white"
                            label={'Histórico'}
                        />
                    </View>
                </View>

                <View className="flex-row items-center justify-between w-full mt-8 mb-4">
                    <View className="flex-1 pr-2">
                        <Text className="text-lg font-PoppinsMedium text-gray-500 mb-1">
                            Data Inicial
                        </Text>
                        <TouchableOpacity
                            onPress={showDatePicker}
                            className={`flex-row items-center justify-between bg-solar-gray-dark border-2 border-white rounded-lg py-2 pl-2 shadow-sm ${
                                Platform.OS === 'ios'
                                    ? 'shadow-gray-300'
                                    : 'shadow-gray-400'
                            }`}
                        >
                            <Text className="text-lg text-solar-blue-dark font-PoppinsMedium">
                                {moment(dateIni).format('DD/MM/YYYY')}
                            </Text>
                            <MaterialCommunityIcons
                                name="calendar-month"
                                size={32}
                                color="#F18800"
                            />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-1 pl-2">
                        <Text className="text-lg font-PoppinsMedium text-gray-500 mb-1">
                            Data Final
                        </Text>
                        <TouchableOpacity
                            onPress={showDatePicker2}
                            className={`flex-row items-center justify-between bg-solar-gray-dark border-2 border-white rounded-lg py-2 pl-2 shadow-sm ${
                                Platform.OS === 'ios'
                                    ? 'shadow-gray-300'
                                    : 'shadow-gray-400'
                            }`}
                        >
                            <Text className="text-lg text-solar-blue-dark font-PoppinsMedium">
                                {moment(dateFin).format('DD/MM/YYYY')}
                            </Text>
                            <MaterialCommunityIcons
                                name="calendar-month"
                                size={32}
                                color="#F18800"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                {crediarios && crediarios.length < 1 && (
                    <View className="flex-col my-6">
                        <View className="w-full flex-col items-center justify-center py-6">
                            <Image
                                source={require('@assets/images/no_payments_logo.png')}
                                className="w-[172px] h-[139px] "
                            />
                            <Text className="text-lg font-PoppinsMedium text-solar-blue-dark mt-4 px-3 text-center">
                                Você não possui nenhum pagamento em aberto.
                            </Text>
                        </View>
                    </View>
                )}
                {crediarios && (
                    <View className="flex-1 w-full h-full pb-2">
                        <FlashList
                            data={crediarios}
                            renderItem={({item}) => (
                                <RenderItem crediario={item} />
                            )}
                            estimatedItemSize={50}
                            keyExtractor={(item: any, index) =>
                                item.filial + index
                            }
                            ItemSeparatorComponent={() => (
                                <View className="h-0.5 bg-solar-gray-darkr" />
                            )}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                )}
            </View>
        </AppLayout>
    );
};

export default HistoryPayments;
