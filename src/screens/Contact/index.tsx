import {View, Text} from 'react-native';
import React from 'react';
import AppLayout from '@components/AppLayout';
import {Image} from 'react-native';

type Props = {};

const Contact = (props: Props) => {
    return (
        <AppLayout>
            <View className="flex-grow items-center justify-start bg-solar-gray-dark">
                <View className="py-4 flex items-center justify-center ">
                    <Text className="text-2xl text-solar-blue-dark font-PoppinsMedium mb-4 text-center">
                        Fale conosco
                    </Text>
                    <View className="flex-col items-center justify-center w-full">
                        <Image
                            source={require('@assets/images/girl_background.png')}
                            resizeMode="cover"
                        />
                    </View>
                    <Text className="text-base text-solar-blue-dark font-PoppinsRegular my-4">
                        Para dúvidas, reclamações ou observações
                    </Text>
                </View>

                <Text className="text-2xl font-PoppinsBold text-solar-blue-dark pt-5">
                    51-3638-5000
                </Text>
                <Text className="text-base font-PoppinsMedium text-solar-blue-dark py-5">
                    sac@lojasolar.com.br
                </Text>
                <Text className="text-lg font-PoppinsRegular text-solar-blue-dark">
                    Av. Duque de Caxias,385
                </Text>
                <Text className="text-lg font-PoppinsRegular text-solar-blue-dark">
                    Centro - Salvador do Sul - RS
                </Text>
                <Text className="text-lg font-PoppinsRegular text-solar-blue-dark">
                    CEP: 95750-000
                </Text>
                <Text className="text-base font-PoppinsMedium text-solar-blue-dark pt-24 text-center">
                    {process.env.EXPO_PUBLIC_APP_VERSION}
                </Text>
            </View>
        </AppLayout>
    );
};

export default Contact;
