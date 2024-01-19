import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform,
} from 'react-native';
import React from 'react';
import AppLayout from '@components/AppLayout';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {RootDrawerParamList} from '@screens/RootDrawerPrams';

const DataAnalise = ({route}: any) => {
    const navigation =
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

    return (
        <AppLayout>
            <View className="flex-1 bg-solar-gray-dark pt-4">
                <View className="flex-col items-center justify-center px-4 pt-4">
                    <View className="flex-col items-center justify-center">
                        <Text allowFontScaling={false} className="text-2xl text-solar-blue-dark py-4">
                            Remoção de dados
                        </Text>
                        <Text allowFontScaling={false} className="text-base text-solar-blue-dark font-PoppinsRegular mb-3 text-center">
                            Nossa equipe proceguirá com o processo para a
                            exclusão de dados.
                        </Text>
                    </View>
                    <Image
                    className="self-center w-72 h-52"
                    source={require('@assets/images/new_password_logo.png')}
                />
                    <Text allowFontScaling={false} className="text-sm text-solar-blue-dark font-PoppinsRegular mt-6 text-center">
                        Aguarde nosso e-mail ou ligação para prosseguir com o
                        processo de exclusão de dados.
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Home')}
                        className={`flex items-center justify-center w-full bg-solar-orange-middle my-6 ${
                            Platform.OS == 'ios'
                                ? 'shadow-sm shadow-gray-300'
                                : 'shadow-sm shadow-black'
                        } py-3 rounded-full border-2 border-white `}
                    >
                        <Text allowFontScaling={false} className="text-lg font-PoppinsMedium text-solar-blue-dark">
                            Entendi
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AppLayout>
    );
};

export default DataAnalise;
