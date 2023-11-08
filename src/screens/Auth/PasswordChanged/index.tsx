import {View, Text, Image, TouchableOpacity, Platform} from 'react-native';
import React from 'react';
import AppLayout from '@components/AppLayout';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootDrawerParamList} from '@screens/RootDrawerPrams';

const PasswordChanged = ({route}: any) => {
    const navigation =
        useNavigation<StackNavigationProp<RootDrawerParamList>>();
    const {data} = route.params;
    return (
        <AppLayout>
            <View className="flex-1 bg-solar-gray-dark pt-4">
                <Image
                    className="self-center w-72 h-52"
                    source={require('@assets/images/successful_password_logo.png')}
                />
                <View className="flex-col items-center justify-center px-12 pt-4">
                    <View className="py-4 flex items-center justify-center ">
                        <Text className="text-2xl text-solar-blue-dark font-PoppinsMedium mb-4 text-center">
                            Senha criada com sucesso!
                        </Text>
                        <Text className="text-base text-solar-blue-dark font-PoppinsRegular mb-4 text-center">
                            Lembre-se você irá utilizar essa senha sempre que
                            fazer login no aplicativo das Lojas Solar.
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() =>
                            navigation.navigate('CheckPassword', {data: data})
                        }
                        className={`flex items-center justify-center w-full bg-solar-orange-middle my-6 ${
                            Platform.OS == 'ios'
                                ? 'shadow-sm shadow-gray-300'
                                : 'shadow-sm shadow-black'
                        } py-3 rounded-full border-2 border-white `}
                    >
                        <Text className="text-lg font-PoppinsMedium text-solar-blue-dark">
                            Continuar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AppLayout>
    );
};

export default PasswordChanged;
