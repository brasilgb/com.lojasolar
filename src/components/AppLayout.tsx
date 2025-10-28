import {StatusBar} from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';

interface Props {
    children: React.ReactNode;
    classname?: any;
}

const AppLayout = ({children, classname}: Props) => {
    return (
        <>
            <View
                className={`flex-1 ${
                    classname?.length ? classname : 'bg-solar-blue-dark'
                }`}
            >
                {children}
            </View>
            <StatusBar translucent style="light" animated />
        </>
    );
};

export default AppLayout;