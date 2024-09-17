import React from 'react';
import {View, Text, Platform, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import AppLayout from '@components/AppLayout';
import {RootDrawerParamList} from '@screens/RootDrawerPrams';

const ImagesSent = () => {
    const navigation =
        useNavigation<StackNavigationProp<RootDrawerParamList>>();

    return (
        <AppLayout>
            <View className="flex-1 bg-solar-gray-dark pt-4">
                <Image
                    className="self-center w-[280] h-52"
                    source={require('@assets/images/need_password_logo.png')}
                />
                <View className="flex-col items-center justify-center px-12 pt-4">
                    <View className="py-4 flex items-center justify-center ">
                        <Text
                            allowFontScaling={false}
                            className="text-2xl text-solar-blue-dark font-PoppinsMedium mb-4 text-center"
                        >
                            Obrigado por se registrar no crediário da Solar
                        </Text>
                        <Text
                            allowFontScaling={false}
                            className="text-sm text-solar-blue-dark font-PoppinsRegular mb-4 text-center"
                        >
                            Suas informações serão analisadas pela equipe das
                            Lojas Solar e entraremos em contato.
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Home')}
                        className={`flex items-center justify-center w-full bg-solar-orange-middle my-6 ${
                            Platform.OS == 'ios'
                                ? 'shadow-sm shadow-gray-300'
                                : 'shadow-sm shadow-black'
                        } py-3 rounded-full border-2 border-white `}
                    >
                        <Text
                            allowFontScaling={false}
                            className="text-lg font-Poppins_500Medium text-solar-blue-dark"
                        >
                            Entendi
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AppLayout>
    );
};

export default ImagesSent;
