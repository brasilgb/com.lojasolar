import { View, Text, TouchableOpacity, Platform } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootDrawerParamList } from '@screens/RootDrawerPrams';
import serviceapp from '@services/serviceapp';
import { AuthContext } from '@contexts/auth';
import AppLayout from '@components/AppLayout';
import MonthPicker from 'react-native-month-year-picker';
import AppLoading from '@components/AppLoading';
import moment from 'moment';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const HistoricoCashback = () => {
    const { user, setLoading, loading, disconnect } = useContext(AuthContext);
    const [historicos, setHistoricos] = useState<any>([]);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const showPicker = useCallback((value: any) => setShow(value), []);
    const navigation = useNavigation<StackNavigationProp<RootDrawerParamList>>();
    const [pdvCustomer, setPdvCustomer] = useState<any>([]);

    useEffect(() => {
        const getPdvCustomer = async () => {
            setLoading(true);
            await serviceapp.post('(LISTA_PDV_CASHBACK)', {
                "codcli": 4522376,
                "meschave": 1,
                "anochave": 2025
            })
                .then((response) => {
                    // console.log('response', response.data.resposta.dados);
                    setPdvCustomer(response.data.resposta.dados);
                })
                .catch((error) => {
                    console.log('error', error);
                }).finally(() => setLoading(false));
        };
        getPdvCustomer();
    }, []);

    const onValueChange = useCallback(
        (event: any, newDate: any) => {
            const selectedDate = newDate || date;

            showPicker(false);
            setDate(selectedDate);
        },
        [date, showPicker],
    );


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
                    <Text
                        allowFontScaling={false}
                        className="text-3xl text-solar-blue-dark py-4 text-center"
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
                    {/* <View className='flex-row items-center justify-end pb-4'>
                    <Text className={`text-lg font-medium px-4 ${1 > 0 ? 'text-emerald-800' : 'text-red-500'}`}>Saldo anterior</Text>
                    <Text className={`rounded-full py-2 px-4 font-bold text-xl ${1 > 0 ? 'bg-solar-green-light text-gray-800' : 'bg-red-500 text-white'}`}>R$185,00</Text>
                    </View> */}
                    <View className='bg-gray-300 rounded-md px-1 pt-1'>
                        {pdvCustomer?.map((pdv: any, idx: number) => (
                            <View key={idx} className='bg-solar-blue-light rounded-md p-1 mb-1'>
                                <View className='flex-row items-center justify-between pb-1'>
                                    <Text className='w-[25%] text-white'>Data pedido</Text>
                                    <Text className='w-[10%] text-white text-right'>Filial</Text>
                                    <Text className='w-[20%] text-white text-right'>N° Pedido</Text>
                                    <Text className='w-[30%] text-white text-right'>Valor</Text>
                                </View>
                                <View className='flex-row items-center justify-between bg-gray-50 p-1 rounded'>
                                    <Text className='w-[25%]'>{pdv.dtpedido}</Text>
                                    <Text className='w-[10%] text-right'>{pdv.filial}</Text>
                                    <Text className='w-[20%] text-right'>{pdv.numpedido}</Text>
                                    <Text className='w-[30%] text-right'>{pdv.total}</Text>
                                </View>
                            </View>
                        ))}

                        {/* <View className='bg-solar-blue-light rounded-md p-1 mt-1'>
                        <View className='flex-row items-center justify-between pb-1'>
                            <Text className='w-[25%] text-white'>Data Pedido</Text>
                            <Text className='w-[10%] text-white text-right'>Filial</Text>
                            <Text className='w-[20%] text-white text-right'>N° Pedido</Text>
                            <Text className='w-[10%] text-white text-right'></Text>
                            <Text className='w-[30%] text-white text-right'>Valor</Text>
                        </View>
                        <View className='flex-row items-center justify-between bg-gray-50 p-1 rounded'>
                            <Text className='w-[25%]'>02/04/2025</Text>
                            <Text className='w-[10%] text-right'>008</Text>
                            <Text className='w-[20%] text-right'>19523</Text>
                            <Text className='w-[10%] text-right'></Text>
                            <Text className='w-[30%] text-right'>R$1.250,00</Text>
                        </View>
                    </View> */}
                    </View>
                </View>
                <View className="my-6">
                    <View className='flex-row items-center justify-end pb-4'>
                        <Text className={`text-lg font-medium px-4 ${1 > 0 ? 'text-emerald-800' : 'text-red-500'}`}>Saldo anterior</Text>
                        <Text className={`rounded-full py-2 px-4 font-bold text-xl ${1 > 0 ? 'bg-solar-green-light text-gray-800' : 'bg-red-500 text-white'}`}>R$185,00</Text>
                    </View>

                    <TouchableOpacity
                        className={`flex items-center justify-center border-2 border-white bg-solar-orange-middle ${Platform.OS == 'ios'
                            ? 'shadow-sm shadow-gray-300'
                            : 'shadow-sm shadow-black'
                            } py-3 rounded-full`}
                        onPress={() => navigation.navigate('StatusCashBack')}
                    >
                        <Text
                            className={`text-lg font-PoppinsMedium self-center text-solar-blue-dark
                            }`}
                        >
                            Solicitar cashback
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AppLayout>
    )
}

export default HistoricoCashback