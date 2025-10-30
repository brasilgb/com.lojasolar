import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

interface Props {
    children: React.ReactNode;
    classname?: any;
}

const AppLayout = ({ children, classname }: Props) => {
    return (
        <SafeAreaProvider>
            <SafeAreaView className={`flex-1 ${classname?.length ? classname : 'bg-solar-blue-light'
                }`}>
                {children}
            </SafeAreaView>
            <StatusBar translucent style="light" animated />
        </SafeAreaProvider>
    );
};

export default AppLayout;