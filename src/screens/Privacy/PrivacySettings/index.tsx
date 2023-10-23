import {
    View,
    Text,
    Switch,
    TouchableOpacity,
    Alert,
    Platform,
} from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import AppLayout from '@components/AppLayout';
import { ListStyle } from '@components/InputStyle';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@screens/RootStackPrams';
import { AuthContext } from '@contexts/auth';
import serviceapp from '@services/serviceapp';
import AppLoading from '@components/AppLoading';

const PrivacySettings = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const { setLoading, loading, disconnect, user } = useContext(AuthContext);

    const [autorizaCliente, setAutorizaCliente] = useState<any>([]);

    const [isEnabledNotify, setIsEnabledNotify] = useState(false);
    const [isEnabledEmail, setIsEnabledEmail] = useState(false);

    const toggleNotify = () => {
        setIsEnabledNotify(previousState => !previousState);
    };
    const toggleEmail = () => {
        setIsEnabledEmail(previousState => !previousState);
    };

    useEffect(() => {
        const getAutorizaCliente = async () => {
            setLoading(true);
            await serviceapp
                .get(`(WS_AUTORIZA_CLIENTE)?token=${user?.token}`)
                .then(response => {
                    const { token, message, data } = response.data.resposta;
                    setLoading(false);
                    if (!token) {
                        Alert.alert('Atenção', message, [
                            {
                                text: 'Ok',
                                onPress: () => {
                                    navigation.navigate('Home'), disconnect();
                                },
                            },
                        ]);
                    }

                    setAutorizaCliente(data?.pergunta);
                    setIsEnabledNotify(
                        data?.pergunta[0]?.resposta === 'S' ? true : false,
                    );
                    setIsEnabledEmail(
                        data?.pergunta[1]?.resposta === 'S' ? true : false,
                    );
                })
                .catch(err => {
                    // console.log(err);
                });
        };
        getAutorizaCliente();
    }, [user]);

    const handleSubmitPrivacity = useCallback(async () => {
        setLoading(true);
        const response = await serviceapp.get(
            `(WS_RESPOSTA_AUTORIZA)?token=${user.token}&resposta1=${isEnabledNotify ? 'S' : 'N'
            }&resposta2=${isEnabledEmail ? 'S' : 'N'}`,
        );
        const { success, message } = response.data.resposta;
        setLoading(false);
        if (!success) {
            Alert.alert('Atenção', message, [
                {
                    text: 'Ok',
                    onPress: () => {
                        navigation.navigate('Home'), disconnect();
                    },
                },
            ]);
        }

        Alert.alert('Atenção', 'Atualização de dados concluída com sucesso', [
            { text: 'Ok' },
        ]);
    }, [isEnabledNotify, isEnabledEmail]);

    return (
        <AppLayout>
            <AppLoading visible={loading} />
            <View className="flex-1 bg-solar-gray-dark px-4">
                <View className="py-4 flex items-center justify-center">
                    <Text className="text-2xl text-solar-blue-dark font-PoppinsMedium mb-4 text-center">
                        Configurações de privacidade
                    </Text>
                    <Text className="text-base text-solar-blue-dark font-PoppinsRegular mb-4">
                        Configure as opções de privacidade abaixo
                    </Text>
                </View>
                <View className="pt-2">
                    <View
                        className={`${ListStyle} flex-row items-center justify-center mb-4`}
                    >
                        <View className="flex-1 py-2">
                            <Text className="text-base text-solar-blue-dark font-PoppinsMedium">
                                {autorizaCliente && autorizaCliente[0]?.texto}
                            </Text>
                        </View>
                        <View>
                            <Switch
                                trackColor={{ false: '#a5a5a5', true: '#F18800' }}
                                thumbColor={
                                    isEnabledNotify ? '#FFF' : '#f4f3f4'
                                }
                                ios_backgroundColor="#a5a5a5"
                                value={isEnabledNotify}
                                onValueChange={toggleNotify}
                            />
                        </View>
                    </View>
                    <View
                        className={`${ListStyle} flex-row items-center justify-center`}
                    >
                        <View className="flex-1 py-2">
                            <Text className="text-base text-solar-blue-dark font-PoppinsMedium">
                                {autorizaCliente && autorizaCliente[1]?.texto}
                            </Text>
                        </View>
                        <View>
                            <Switch
                                trackColor={{ false: '#a5a5a5', true: '#F18800' }}
                                thumbColor={isEnabledEmail ? '#FFF' : '#f4f3f4'}
                                ios_backgroundColor="#a5a5a5"
                                value={isEnabledEmail}
                                onValueChange={toggleEmail}
                            />
                        </View>
                    </View>

                    <View className="my-6">
                        <TouchableOpacity
                            className={`flex items-center justify-center border-2 border-white ${Platform.OS == 'ios'
                                ? 'shadow-sm shadow-gray-300'
                                : 'shadow-sm shadow-black'
                                } py-3 rounded-full bg-solar-orange-middle`}
                            onPress={() => handleSubmitPrivacity()}
                        >
                            <Text className="text-lg font-PoppinsMedium self-center text-solar-blue-dark">
                                Concluir
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </AppLayout>
    );
};

export default PrivacySettings;
