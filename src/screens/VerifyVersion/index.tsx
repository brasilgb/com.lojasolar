import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Platform,
    Linking,
    BackHandler,
} from 'react-native';
import AppLayout from '@components/AppLayout';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const VerifyVersion = ({ route }: any) => {
    const { data } = route.params;
    if (data) {
        useEffect(() => {
            BackHandler.addEventListener('hardwareBackPress', function () { return true });
        }, []);
    }

    return (
        <AppLayout>
            <View className="flex-1 bg-solar-gray-dark pt-4">
                <View className="flex-1 flex-col items-center justify-between px-12 pt-4 mb-10">
                    <View className="mb-10">
                        <Text allowFontScaling={false} className="text-3xl text-solar-blue-dark py-8 text-center">
                            Nova versão do aplicativo disponível
                        </Text>
                        <Text className="text-lg text-solar-blue-dark font-PoppinsRegular mb-4 px-8 text-center">
                            Está disponível a nova versão do aplicativo das Lojas Solar, clique no botão atualizar para realizar a atualização.
                        </Text>
                    </View>
                    <View>
                        <FontAwesome name="gears" size={120} color={'#acacac'} />
                    </View>
                    <View className='py-4'>
                        <Text allowFontScaling={false} className='text-sm font-semibold '>Versão atual: {data.atual}</Text>
                        <Text allowFontScaling={false} className='text-sm font-semibold '>Versão indicada: {data.nova}</Text>
                    </View>
                    <View className='w-full'><TouchableOpacity
                        onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.loja.solar')}
                        className={`flex items-center justify-center w-full bg-solar-orange-middle ${Platform.OS == 'ios'
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
            </View>

        </AppLayout>
    );
};

export default VerifyVersion;