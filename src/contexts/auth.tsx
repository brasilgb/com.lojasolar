import { Alert } from 'react-native';
import React, { createContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import serviceapp from '../services/serviceapp';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const AuthContext = createContext({} as any);
import { RootDrawerParamList } from '@screens/RootDrawerPrams';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import DeviceInfo from "react-native-device-info";

interface AuthContextProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthContextProps) => {
    const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [positionGlobal, setPositionGlobal] = useState<any>([0, 0]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [dataMap, setDataMap] = useState<any>([]);

    // Armazena usuário no storage
    async function storageUser(data: any) {
        await AsyncStorage.setItem('Auth_user', JSON.stringify(data));
    }

    useEffect(() => {
        async function loadStorage() {
            const storageUser = await AsyncStorage.getItem('Auth_user');
            if (storageUser) {
                setUser(JSON.parse(storageUser));
            }
        }
        loadStorage();
    }, []);

    useEffect(() => {
        async function loadPosition() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
            }
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            setPositionGlobal([latitude, longitude]);
        }
        loadPosition();
    }, []);

    const signIn = async (cpfcnpj: any) => {
        setLoading(true);
        const response = await serviceapp.get(`(WS_LOGIN_APP)?cpfcnpj=${cpfcnpj}`);
        if (response.status !== 200) {
            setLoading(false);
            Alert.alert(
                'Error',
                'Erro ao conectar ao servidor. O serviço da aplicação parece estar parado.',
            );
        }
        const { data } = response.data.resposta;
        if (data.cadastroCliente && data.cadastroSenha) {
            setLoading(false);
            navigation.navigate('CheckPassword', {
                data: { cpfCnpj: cpfcnpj, nomeCliente: data.nomeCliente, codigoCliente: data.codigoCliente },
            });
        }
        if (!data.cadastroCliente && !data.cadastroSenha) {
            setLoading(false);
            navigation.navigate('NoRegistered', {
                data: { cpfCnpj: cpfcnpj, nomeCliente: data.nomeCliente },
            });
        }
        if (data.cadastroCliente && !data.cadastroSenha) {
            setLoading(false);
            navigation.navigate('Registered', {
                data: { cpfCnpj: cpfcnpj, nomeCliente: data.nomeCliente },
            });
        }
    };

    const checkPassword = async ({ cpfcnpj, senha, nomeCliente, codigoCliente, connected }: any) => {
            setLoading(true);
            let deviceId = DeviceInfo.getDeviceId();
            const response = await serviceapp.get(`(WS_VERIFICAR_SENHA_APP)?cpfcnpj=${cpfcnpj}&senha=${senha}&deviceId=${deviceId}`);

            if (response.status !== 200) {
                setLoading(false);
                Alert.alert(
                    'Error',
                    'Erro ao conectar ao servidor. O serviço da aplicação parece estar parado.',
                );
                return;
            }

            const { success, message, data } = response.data.resposta;
            if (!success) {
                setLoading(false);
                setUser(null);
                Alert.alert('Erro', `${message}`);
                return;
            }

            let userData = {
                cpfCnpj: cpfcnpj,
                nomeCliente: nomeCliente,
                codigoCliente: codigoCliente,
                token: data.token,
                connected: connected,
            };
            setLoading(false);
            storageUser(userData);
            setUser(userData);
            navigation.navigate('Home');
        };

    async function signOut() {
        Alert.alert(
            'Atenção - Ação de Logout',
            'Você será desconectado, deseja continuar?',
            [
                { text: 'Sim', onPress: () => disconnect() },
                {
                    text: 'Não',
                    style: 'cancel',
                },
            ],
            { cancelable: false },
        );
    }

    async function disconnect() {
        await AsyncStorage.clear().then(() => {
            setUser(null);
        });
        navigation.navigate('Home');
    }

    return (
        <AuthContext.Provider
            value={{
                signed: !!user,
                user,
                setUser,
                storageUser,
                setLoading,
                loading,
                positionGlobal,
                signIn,
                checkPassword,
                signOut,
                disconnect,
                modalVisible,
                setModalVisible,
                dataMap,
                setDataMap,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};