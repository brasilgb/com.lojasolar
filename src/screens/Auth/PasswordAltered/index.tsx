import {View, Text, Image, TouchableOpacity, Platform} from 'react-native';
import React from 'react';
import AppLayout from '@components/AppLayout';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {RootDrawerParamList} from '@screens/RootDrawerPrams';

const PasswordAltered = ({route}: any) => {
    const {data} = route.params;
    const navigation =
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    return (
        <AppLayout>
            <View className="flex-1 bg-solar-gray-dark pt-4">
                <Image
                    className="self-center w-72 h-52"
                    source={require('@assets/images/new_password_logo.png')}
                />
                <View className="flex-col items-center justify-center px-12 pt-4">
                    <View className="py-4 flex items-center justify-center ">
                        <Text
                            allowFontScaling={false}
                            className="text-2xl text-solar-blue-dark font-PoppinsMedium mb-4 text-center"
                        >
                            Enviamos uma nova senha para o seu e-mail
                        </Text>
                        <Text
                            allowFontScaling={false}
                            className="my-4 font-PoppinsLight text-lg text-center text-solar-yellow-dark"
                        >
                            {data}
                        </Text>
                        <Text
                            allowFontScaling={false}
                            className="text-sm text-solar-blue-dark font-PoppinsRegular mb-4 text-center"
                        >
                            Acesse seu e-mail e entre com a sua nova senha, você
                            poderá alterar sua senha no menu Minha Conta.
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignIn')}
                        className={`flex items-center justify-center w-full bg-solar-orange-middle my-6 ${
                            Platform.OS == 'ios'
                                ? 'shadow-sm shadow-gray-300'
                                : 'shadow-sm shadow-black'
                        } py-3 rounded-full border-2 border-white `}
                    >
                        <Text
                            allowFontScaling={false}
                            className="text-lg font-PoppinsMedium text-solar-blue-dark"
                        >
                            Fazer login
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AppLayout>
    );
};

export default PasswordAltered;
