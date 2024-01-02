import {
    View,
    Text,
    TouchableOpacity,
    Platform,
} from 'react-native';
import React from 'react';
import AppLayout from '@components/AppLayout';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '@screens/RootDrawerPrams';
import { FontAwesome } from '@expo/vector-icons';
const VerifyVersion = () => {
    const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

    return (
        <AppLayout>
            <View className="flex-1 bg-solar-gray-dark pt-4">
                <View className="flex-col items-center justify-between px-12 pt-4 mb-10">
                    <View className="mb-10">
                        <Text allowFontScaling={false} className="text-3xl text-solar-blue-dark py-4">
                            Nova versão do App
                        </Text>
                        <Text className="text-base text-solar-blue-dark font-PoppinsRegular mb-4 px-8 text-center">
                            Está disponível a nova versão do aplicativo das Lojas Solar 
                        </Text>
                    </View>
                    <FontAwesome name="gears" size={120} color={'#acacac'} />
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Home')}
                            className={`flex items-center justify-center w-full bg-solar-orange-middle my-16 ${Platform.OS == 'ios'
                                ? 'shadow-sm shadow-gray-300'
                                : 'shadow-sm shadow-black'
                                } py-3 rounded-full border-2 border-white `}
                        >
                            <Text allowFontScaling={false} className="text-lg font-PoppinsMedium text-solar-blue-dark">
                                Atualizar
                            </Text>
                        </TouchableOpacity>
                </View>
            </View>

        </AppLayout>
    );
};

export default VerifyVersion;