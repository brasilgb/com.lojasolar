import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {SafeAreaView} from 'react-native';

interface Props {
    children: React.ReactNode;
    classname?: any;
}

const AppLayout = ({children, classname}: Props) => {
    return (
        <>
            <SafeAreaView
                className={`flex-1 pb-12 ${
                    classname?.length ? classname : 'bg-solar-blue-light'
                }`}
            >
                {children}
            </SafeAreaView>
            <StatusBar translucent style="light" animated />
        </>
    );
};

export default AppLayout;