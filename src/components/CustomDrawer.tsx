import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerNavigationProp,
} from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native-gesture-handler';
import { AuthContext } from '@contexts/auth';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { RootDrawerParamList } from '@screens/RootDrawerPrams';

const CustomDrawer = (props: any) => {
    const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    const { signed, user, signOut } = useContext(AuthContext);


    return (
        <View className="h-full">
            <View className="p-4 bg-solar-blue-light rounded-tr-lg">
                <View className="flex-row items-center justify-start mt-8">
                    <MaterialIcons
                        name="account-circle"
                        size={50}
                        color={'#FAFAFA'}
                    />
                    <Text
                        allowFontScaling={false}
                        className="text-sm text-solar-gray-light font-Poppins_400Regular"
                    >
                        {signed
                            ? `Olá, ${user?.nomeCliente}`
                            : 'Bem Vindo(a) '}
                    </Text>
                </View>

                <Text className="mt-2 text-sm text-solar-gray-light font-Poppins_400Regular"
                >
                    {signed
                        ? 'Como podemos lhe ajudar hoje?'
                        : 'Faça o login e aproveite o melhor do aplicativo'}
                </Text>
            </View>
            <DrawerContentScrollView
                {...props}
                scrollEnabled={true}
                drawerHideStatusBarOnOpen={'slide'}
            >
                <View className=" bg-solar-gray-middle w-full">
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>

            <View className="py-2 border-t border-gray-200">
                {signed && (
                    <Pressable
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
                        <Text
                            allowFontScaling={false}
                            className="ml-1 text-base text-[#e76464] font-PoppinsRegular"
                        >
                            Sair
                        </Text>
                    </Pressable>
                )}
                {!signed && (
                    <Pressable
                        onPress={() => navigation.navigate('SignIn')}
                        className="flex-row items-center justify-start ml-5"
                    >
                        <MaterialIcons
                            name="logout"
                            size={22}
                            color={'#0d3b85'}
                        />
                        <Text
                            allowFontScaling={false}
                            className="ml-1 text-base font-PoppinsRegular text-[#0d3b85]"
                        >
                            Login
                        </Text>
                    </Pressable>
                )}
            </View>

            <View className="h-16 bg-solar-gray-middle border-t border-t-gray-200 flex-row items-center justify-around mb-10">
                <Pressable
                    className="p-2"
                    onPress={() => navigation.navigate('Questions')}
                >
                    <Text
                        allowFontScaling={false}
                        className="text-[10px] font-Poppins_400Regular text-solar-blue-dark"
                    >
                        Perguntas frequentes
                    </Text>
                </Pressable>
                <Pressable
                    className="p-2"
                    onPress={() => navigation.navigate('PrivacyPolice')}
                >
                    <Text
                        allowFontScaling={false}
                        className="text-[10px] font-Poppins_400Regular text-solar-blue-dark"
                    >
                        Política de privacidade
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

export default CustomDrawer;
