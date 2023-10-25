import AppLoading from "@components/AppLoading";
import { AuthContext } from "@contexts/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { RootDrawerParamList } from "@screens/RootDrawerPrams";
import React, { useContext, useEffect } from 'react'

const Connected = () => {
    const { disconnect, setLoading, loading } = useContext(AuthContext);
    const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

    // Redireciona para home
    useEffect(() => {
        const getConnected = async () => {
            setLoading(true);
            const storageUser: any = await AsyncStorage.getItem('Auth_user');
            const user = JSON.parse(storageUser);
            console.log(user);
            if (user?.connected === false) {
                disconnect();
            }
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
            setLoading(false);
        }
        getConnected();
    }, []);
    return <AppLoading visible={loading} />
}

export default Connected;