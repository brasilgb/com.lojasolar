import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {SafeAreaView, View} from 'react-native';

interface Props {
    children: React.ReactNode;
}

const AppLayout = ({children}: Props) => {
    return (
        <>
            <SafeAreaView className="flex-1 bg-solar-blue-light">
                {children}
            </SafeAreaView>
            <StatusBar translucent style="light" animated />
        </>
    );
};
export default AppLayout;
