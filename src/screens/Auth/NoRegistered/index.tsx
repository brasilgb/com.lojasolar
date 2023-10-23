import {View, Text, TouchableOpacity, Platform, Image} from 'react-native';
import React from 'react';
import AppLayout from '@components/AppLayout';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootDrawerParamList} from '@screens/RootDrawerPrams';

const NoRegistered = ({route}: any) => {
    const navigation = useNavigation<StackNavigationProp<RootDrawerParamList>>();
    const {data} = route.params;
    return (
        <AppLayout>
            <View className="flex-1 bg-solar-gray-dark pt-4">
                <Image
                    className="self-center"
                    source={require('@assets/images/registration.png')}
                />
                <View className="flex-col items-center justify-center px-12 pt-4">
                    <View className="py-4 flex items-center justify-center ">
                        <Text className="text-2xl text-solar-blue-dark font-PoppinsMedium mb-4 text-center">
                            Você ainda não possui um cadastro!
                        </Text>
                        <Text className="text-base text-solar-blue-dark font-PoppinsRegular mb-4 text-center">
                            Faça o seu cadastro nas Lojas Solar para acessar
                            todas as facilidades do aplicativo
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() =>
                            navigation.navigate('RegisterUser', {data: data})
                        }
                        className={`flex items-center justify-center w-full bg-solar-orange-middle my-6 ${
                            Platform.OS == 'ios'
                                ? 'shadow-sm shadow-gray-300'
                                : 'shadow-sm shadow-black'
                        } py-3 rounded-full border-2 border-white `}
                    >
                        <Text className="text-lg font-PoppinsMedium text-solar-blue-dark">
                            Iniciar cadastro
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AppLayout>
    );
};

export default NoRegistered;
