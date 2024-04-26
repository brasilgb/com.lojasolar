import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerNavigationProp,
} from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '@contexts/auth';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { RootDrawerParamList } from '@screens/RootDrawerPrams';

const CustomDrawer = (props: any) => {
    const navigation =
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    const { signed, user, signOut } = useContext(AuthContext);

    return (
        <View className="flex-1">
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{ backgroundColor: '#009FE3' }}
            >
                <View className="p-3 mb-3">
                    <View className="flex-row items-center justify-start w-60">
                        <MaterialIcons
                            name="account-circle"
                            size={50}
                            color={'#FAFAFA'}
                        />
                        <Text allowFontScaling={false} className="text-sm text-solar-gray-light font-Poppins_400Regular pl-4 pr-5">
                            {signed
                                ? `Olá, ${user?.nomeCliente}`
                                : 'Bem Vindo(a) '}
                        </Text>
                    </View>

                    <Text allowFontScaling={false} className="mt-2 text-sm text-solar-gray-light font-Poppins_400Regular">
                        {signed
                            ? 'Como podemos lhe ajudar hoje?'
                            : 'Faça o login e aproveite o melhor do aplicativo'}
                    </Text>
                </View>
                <View className="flex-1 bg-solar-gray-middle pt-2.5">
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>

            <View className="py-2 border-t border-gray-200">
                {signed && (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.dispatch(DrawerActions.closeDrawer());
                            signOut();
                        }}
                        className="flex-row items-center justify-start ml-5"
                    >
                        <MaterialIcons
                            name="logout"
                            size={22}
                            color={'#e76464'}
                        />
                        <Text allowFontScaling={false} className="ml-1 text-base text-[#e76464] font-PoppinsRegular">
                            Sair
                        </Text>
                    </TouchableOpacity>
                )}
                {!signed && (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignIn')}
                        className="flex-row items-center justify-start ml-5"
                    >
                        <MaterialIcons
                            name="logout"
                            size={22}
                            color={'#0d3b85'}
                        />
                        <Text allowFontScaling={false} className="ml-1 text-base font-PoppinsRegular text-[#0d3b85]">
                            Login
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <View className="h-16 bg-solar-gray-middle border-t border-t-gray-200 flex-row items-center justify-around">
                <TouchableOpacity
                    className="p-2"
                    onPress={() => navigation.navigate('Questions')}
                >
                    <Text allowFontScaling={false} className="text-[10px] font-Poppins_400Regular text-solar-blue-dark">
                        Perguntas frequentes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="p-2"
                    onPress={() => navigation.navigate('PrivacyPolice')}
                >
                    <Text allowFontScaling={false} className="text-[10px] font-Poppins_400Regular text-solar-blue-dark">
                        Política de privacidade
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CustomDrawer;
