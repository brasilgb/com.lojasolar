import { View, Text, TouchableOpacity, Platform, Pressable } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootDrawerParamList } from '@screens/RootDrawerPrams';
import serviceapp from '@services/serviceapp';
import { AuthContext } from '@contexts/auth';
import AppLayout from '@components/AppLayout';
import MonthPicker from 'react-native-month-year-picker';
import AppLoading from '@components/AppLoading';
import moment from 'moment';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import MoneyPTBR from '@components/MoneyPTBRSimbol';

const HistoricoCashback = ({ route }: any) => {
    const { user, setLoading, loading } = useContext(AuthContext);
    const [activeOrder, setActiveOrder] = useState<any>(null);
    const [cashbackSolicitado, setCashbackSolicitado] = useState<any>([]);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const isFocused = useIsFocused();
    const showPicker = useCallback((value: any) => setShow(value), []);
    const navigation = useNavigation<StackNavigationProp<RootDrawerParamList>>();
    const [pdvCustomer, setPdvCustomer] = useState<any>([]);
    const { cred } = route?.params;

    useEffect(() => {
        const getPdvCustomer = async () => {
            setLoading(true);
            await serviceapp.post('(LISTA_PDV_CASHBACK)', {
                "codcli": parseInt(user?.codigoCliente),
                "meschave": parseInt(moment(date).format("M")),
                "anochave": parseInt(moment(date).format("YYYY"))
            })
                .then((response) => {
                    // console.log('response', response.data.resposta.dados);
                    setPdvCustomer(response.data.resposta.dados);
                })
                .catch((error) => {
                    console.log('error', error);
                }).finally(() => setLoading(false));
        };

        if (isFocused) {
            getPdvCustomer();
        }
    }, [user, date, isFocused]);

    const onValueChange = useCallback(
        (event: any, newDate: any) => {
            const selectedDate = newDate || date;

            showPicker(false);
            setDate(selectedDate);
        },
        [date, showPicker],
    );

    const handleSelectCachback = (id: any, item: any) => {
        setActiveOrder(id);
        setCashbackSolicitado(item);
    }

    const handleCashbackRequest = async () => {
        let maxCashbach = (cashbackSolicitado.total * 17) / 100;
        let applyCashback = (cred?.credTotal >= maxCashbach.toFixed(2)) ? maxCashbach.toFixed(2) : cred?.credTotal;
        await serviceapp.post('(WS_GRAVA_CASHBACK)', {
            "datped": cashbackSolicitado.dtpedido,
            "numped": cashbackSolicitado.numpedido,
            "codcli": user?.codigoCliente,
            "datsol": moment().format('YYYYMMDD'),
            "vlrtot": cashbackSolicitado.total,
            "vlrcash": applyCashback,
            "105depto": 1,
            "105orige": cred?.data?.orige,
            "105serie": cred?.data?.serie,
            "105numnf": cred?.data?.numnf,
        }).then((response) => {
            console.log(response.data.respcash.success);
            setDate(new Date);
            navigation.navigate('CashbackRequested', { item: cashbackSolicitado });
        })
    }

    const renderItem = ({ item, index }: any) => (
        <TouchableOpacity onPress={() => handleSelectCachback(index, item)} className={`border border-gray-50 rounded p-1 my-2 ${activeOrder == index ? 'bg-solar-green-light' : 'bg-solar-blue-light'}`}>
            {activeOrder == index && <Text className='absolute z-50 -top-0.5 right-0 text-solar-green-light'>
                <MaterialCommunityIcons name="check-circle" size={26} />
            </Text>}
            <View className='bg-solar-blue-light rounded-md p-1'>
                <View className='flex-row items-center justify-between pb-1'>
                    <Text className='w-[25%] text-white'>Data pedido</Text>
                    <Text className='w-[10%] text-white'>Filial</Text>
                    <Text className='w-[20%] text-white'>N° Pedido</Text>
                    <Text className='w-[30%] text-white'>Valor</Text>
                </View>
                <View className='flex-row items-center justify-between bg-gray-50 p-1 rounded'>
                    <Text className='w-[25%]'>{item.dtpedido}</Text>
                    <Text className='w-[10%]'>{item.filial}</Text>
                    <Text className='w-[20%]'>{item.numpedido}</Text>
                    <Text className='w-[30%]'>{item.total}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const PdvList = () => {
        return (
            <FlashList
                data={pdvCustomer}
                renderItem={renderItem}
                estimatedItemSize={50}
            />
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
            <View className='bg-gray-50 flex-1 px-2'>
                <View className='flex-1 py-4 w-full'>
                    <Pressable
                        onPress={() => navigation.navigate('CashBack')}
                    >
                        <MaterialCommunityIcons name='arrow-left' size={25} color="#1a9cd9" />
                    </Pressable>
                    <Text
                        allowFontScaling={false}
                        className="text-2xl text-solar-blue-dark text-center"
                    >
                        Histórico de pedidos
                    </Text>
                    <View className='flex-row items-center justify-center'>
                        <TouchableOpacity
                            onPress={() => showPicker(true)}
                            className={`w-48 mb-6 flex-row items-center justify-between bg-solar-gray-dark border-2 border-white rounded-lg py-2 pl-2 shadow-sm ${Platform.OS === 'ios'
                                ? 'shadow-gray-300'
                                : 'shadow-gray-400'
                                }`}
                        >
                            <Text
                                allowFontScaling={false}
                                className="flex-1 text-lg text-center text-solar-blue-dark font-PoppinsMedium"
                            >
                                {moment(date).format('MM/YYYY')}
                            </Text>
                            <MaterialCommunityIcons
                                name="calendar-month"
                                size={32}
                                color="#F99F1E"
                            />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text>*Selecione um pedido abaixo para usar seu saldo.</Text>
                    </View>
                    <View className='flex-1 w-full'>
                        <PdvList />
                    </View>
                </View>
                <View className="my-6">
                    <View className='flex-row items-center justify-end pb-4'>
                        <Text className={`text-lg font-medium px-4 ${cred?.credTotal > 0 ? 'text-emerald-800' : 'text-red-500'}`}>Saldo disponível</Text>
                        <Text className={`rounded-full py-2 px-4 font-bold text-xl ${cred?.credTotal > 0 ? 'bg-solar-green-light' : 'bg-red-500'} text-white`}>{MoneyPTBR(cred?.credTotal)}</Text>
                    </View>

                    <TouchableOpacity
                        disabled={activeOrder === null ? true : false}
                        className={`flex items-center justify-center border-2 border-white  
                            ${activeOrder === null ? 'bg-solar-gray-dark' : 'bg-solar-orange-middle'}
                            ${Platform.OS == 'ios'
                                ? 'shadow-sm shadow-gray-300'
                                : 'shadow-sm shadow-black'
                            } py-3 rounded-full`}
                        onPress={() => handleCashbackRequest()}
                    >
                        <Text
                            className={`text-lg font-PoppinsMedium self-center
                                ${activeOrder === null ? 'text-gray-400' : 'text-solar-blue-dark'}
                            }`}
                        >
                            Solicitar cashback{activeOrder}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AppLayout>
    )
}

export default HistoricoCashback