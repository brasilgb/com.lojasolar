import React, {useContext} from 'react';
import AppLayout from '@components/AppLayout';
import AppLoading from '@components/AppLoading';
import {View, Text} from 'react-native';
import {AuthContext} from '@contexts/auth';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Crediario from './Crediario';
import Comercial from './Comercial';

const Tab = createMaterialTopTabNavigator();

const Questions = () => {
    const {loading, setLoading} = useContext(AuthContext);
    return (
        <AppLayout>
            <AppLoading visible={loading} />
            <View className="flex-col items-center justify-start bg-solar-gray-dark px-4">
                <View className="flex-col items-center justify-center">
                    <Text allowFontScaling={false} className="text-3xl text-solar-blue-dark py-4">
                        Perguntas frequentes
                    </Text>
                    <Text allowFontScaling={false} className="text-base text-solar-blue-dark font-PoppinsRegular mb-4 px-8 text-center">
                        Elaboramos respostas para as dúvidas mais frequentes,
                        selecione o assunto e confira
                    </Text>
                </View>
            </View>
            <View className="flex-1">
                <Tab.Navigator
                    screenOptions={{
                        tabBarLabelStyle: {fontSize: 14},
                        tabBarItemStyle: {width: 150},
                        tabBarStyle: {backgroundColor: '#00AEEF'},
                        tabBarGap: 10,
                        tabBarActiveTintColor: '#fff',
                        tabBarIndicatorStyle: {backgroundColor: '#fff'},
                    }}
                >
                    <Tab.Screen
                        name="Comercial"
                        component={Comercial}
                        options={{
                            tabBarLabel: 'Comercial',
                        }}
                    />

                    <Tab.Screen
                        name="Crediario"
                        component={Crediario}
                        options={{
                            tabBarLabel: 'Crediário',
                        }}
                    />
                </Tab.Navigator>
            </View>
        </AppLayout>
    );
};

export default Questions;
