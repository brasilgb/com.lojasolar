import React, { useContext, useEffect } from 'react'
import { AuthContext } from "@contexts/auth";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootDrawerParamList } from "@screens/RootDrawerPrams";

export const Connected = () => {

    const { disconnect, user } = useContext(AuthContext);
    const navigation = useNavigation<StackNavigationProp<RootDrawerParamList>>();

    useEffect(() => {
        const getConnected = async () => {
            console.log('Connected result: ', user?.connected);
            if (user?.connected === false) {
                await disconnect();
            }
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        };
        getConnected();
    }, []);

    return <></>
}