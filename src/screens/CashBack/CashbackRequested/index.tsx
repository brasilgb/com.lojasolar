import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootDrawerParamList } from '@screens/RootDrawerPrams';

export default function CashbackRequested({ route }: any) {

    const navigation = useNavigation<StackNavigationProp<RootDrawerParamList>>();
    const { item } = route?.params;
    return (
        <View className='flex-1 py-4 px-2'>
            <Pressable
                onPress={() => navigation.navigate('CashBack')}
            >
                <MaterialCommunityIcons name='arrow-left' size={25} color="#1a9cd9" />
            </Pressable>
            <View className='flex-1 flex-row items-center justify-center'>
                <Text className='text-solar-green-light'>
                    <MaterialIcons name="currency-exchange" size={100} />
                </Text>
            </View>
            <View className='flex-1 flex-col items-center'>
                <Text className='text-lg font-semibold text-gray-500'>Cashback solicitado com sucesso</Text>
                <Text className='mt-6 text-lg font-semibold'>Pedido</Text>
                <Text className='text-2xl font-bold text-solar-blue-dark'>{item.numpedido}</Text>
                <Text className='text-sm font-semibold text-gray-500 mt-6'>Verifique no caixa para confirmar</Text>
            </View>
        </View>
    )
}