import { View, Text, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootDrawerParamList } from '@screens/RootDrawerPrams';
import StatusCashback from './StatusCashBack';
const CashBack = () => {
    const navigation = useNavigation<StackNavigationProp<RootDrawerParamList>>();
    return (
        <View className='flex-1 px-2'>
            <View className='flex-1 py-4'>
                <View className='flex-row items-center justify-end pb-4'>
                    <Text className={`text-lg font-medium px-4 ${1 > 0 ? 'text-emerald-800' : 'text-red-500'}`}>Saldo anterior</Text>
                    <Text className={`rounded-full py-2 px-4 font-bold text-xl ${1 > 0 ? 'bg-solar-green-light text-gray-800' : 'bg-red-500 text-white'}`}>R$185,00</Text>
                </View>
                <View className='bg-gray-300 rounded-md p-1'>
                    <View className='bg-solar-blue-light rounded-md p-1'>
                        <View className='flex-row items-center justify-between pb-1'>
                            <Text className='w-[25%] text-white'>Data Compra</Text>
                            <Text className='w-[10%] text-white text-right'>Filial</Text>
                            <Text className='w-[20%] text-white text-right'>Nota</Text>
                            <Text className='w-[10%] text-white text-right'>Série</Text>
                            <Text className='w-[30%] text-white text-right'>Valor</Text>
                        </View>
                        <View className='flex-row items-center justify-between bg-gray-50 p-1 rounded'>
                            <Text className='w-[25%]'>02/04/2025</Text>
                            <Text className='w-[10%] text-right'>008</Text>
                            <Text className='w-[20%] text-right'>1563298</Text>
                            <Text className='w-[10%] text-right'>E03</Text>
                            <Text className='w-[30%] text-right'>R$1.250,00</Text>
                        </View>
                    </View>
                    <View className='bg-solar-blue-light rounded-md p-1 mt-1'>
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
                    </View>
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
    )
}

export default CashBack