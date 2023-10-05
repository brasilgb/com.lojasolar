import {View, Text, Image, TouchableOpacity, Platform} from 'react-native';
import React from 'react';
import AppLayout from '@components/AppLayout';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {RootDrawerParamList} from '@screens/RootStackPrams';
import {MaterialIcons} from '@expo/vector-icons';

const PayCartOk = () => {
    const navigation =
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    return (
        <AppLayout>
            <View className="flex-1 bg-solar-gray-dark pt-4">
                <View className="flex-col items-center justify-center px-12 pt-4">
                    <View className="flex-col items-center justify-center">
                        <Text className="text-3xl text-solar-blue-dark py-4">
                            Pagamento
                        </Text>
                        <Text className="text-base text-solar-blue-dark font-PoppinsRegular mb-4 px-8 text-center">
                            Cartão de crédito
                        </Text>
                    </View>
                    <MaterialIcons name="check" size={120} color={'#154295'} />
                    <Text className="text-sm text-solar-blue-dark font-PoppinsRegular mt-6 text-center">
                        Cobrança gerada com sucesso!
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Home')}
                        className={`flex items-center justify-center w-full bg-solar-orange-middle my-6 ${
                            Platform.OS == 'ios'
                                ? 'shadow-sm shadow-gray-300'
                                : 'shadow-sm shadow-black'
                        } py-3 rounded-full border-2 border-white `}
                    >
                        <Text className="text-lg font-PoppinsMedium text-solar-blue-dark">
                            Retornar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AppLayout>
    );
};

export default PayCartOk;
