import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform,
    BackHandler,
} from 'react-native';
import React, {useEffect} from 'react';
import AppLayout from '@components/AppLayout';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {RootDrawerParamList} from '@screens/RootDrawerPrams';
import {MaterialIcons} from '@expo/vector-icons';

const DataAnalise = ({route}: any) => {
    const {email} = route.params;
    const navigation =
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

    return (
        <AppLayout>
            <View className="flex-1 bg-solar-gray-dark pt-4">
                <View className="flex-col items-center justify-center px-4 pt-4">
                    <View className="flex-col items-center justify-center">
                        <Text className="text-2xl text-solar-blue-dark py-4">
                            Remoção de dados
                        </Text>
                        <Text className="text-base text-solar-blue-dark font-PoppinsRegular mb-1 px-8 text-center">
                            Nossa equipe proceguirá com o processo para a
                            exclusão de dados, logo enviaremos instruções para
                        </Text>
                        <Text className="text-sm text-solar-blue-dark font-PoppinsRegular mb-4 text-center">
                            {email}
                        </Text>
                    </View>
                    <MaterialIcons name="email" size={120} color={'#154295'} />
                    <Text className="text-sm text-solar-blue-dark font-PoppinsRegular mt-6 text-center">
                        Aguarde nosso e-mail ou ligação e prossiga com o
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
                        <Text className="text-lg font-PoppinsMedium text-solar-blue-dark">
                            Entendi
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AppLayout>
    );
};

export default DataAnalise;
