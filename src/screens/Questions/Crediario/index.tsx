import {View, Text, ScrollView} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MaterialIcons} from '@expo/vector-icons';
import serviceapp from '@services/serviceapp';
import {AuthContext} from '@contexts/auth';
import AppLoading from '@components/AppLoading';

const Crediario = () => {
    const {setLoading, loading} = useContext(AuthContext);
    const [crediarios, setCrediarios] = useState<any>([]);
    const [idFaq, setIdFaq] = useState(null);

    const handleOpenFaq = (idx: any) => {
        setIdFaq(idx);
    };

    useEffect(() => {
        const getCrediarios = async () => {
            setLoading(true);
            await serviceapp
                .get('(WS_CARREGA_FAQ)')
                .then(response => {
                    setLoading(false);
                    const result =
                        response.data.resposta.data.categorias.filter(
                            (c: any) =>
                                c.Categoria.xCategoria.trim() === 'Crediário',
                        );
                    const resp = result.map(
                        (cat: any, index: any) => cat.Categoria,
                    );
                    setCrediarios(resp);
                })
                .catch(err => {
                    console.log(err);
                });
        };
        getCrediarios();
    }, []);

    return (
        <View className="bg-gray-200">
            <AppLoading visible={loading} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View className="mb-4">
                    {crediarios.map((crediario: any) =>
                        crediario.perguntas
                            .filter((com: any) => com.resposta != '')
                            .map((per: any, idx: number) => (
                                <View key={idx}>
                                    <TouchableOpacity
                                        onPress={() => handleOpenFaq(idx)}
                                        className={`flex-row items-center justify-between py-6 px-4 ${
                                            crediarios.length > 0
                                                ? 'border-t border-t-gray-300'
                                                : ''
                                        }`}
                                    >
                                        <View className="flex-1">
                                            <Text
                                                allowFontScaling={false}
                                                className="text-sm font-PoppinsMedium"
                                            >
                                                {per?.pergunta}
                                            </Text>
                                        </View>
                                        <View
                                            className={`w-8 ${
                                                idFaq === idx
                                                    ? '-rotate-180'
                                                    : 'rotate-0'
                                            } transition-all duration-500`}
                                        >
                                            <MaterialIcons
                                                name="expand-less"
                                                size={30}
                                                color="#F99F1E"
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    {idFaq === idx && (
                                        <View className="border-b border-b-gray-300 pb-4 transition-all duration-500">
                                            <View className="px-4">
                                                <Text
                                                    allowFontScaling={false}
                                                    className="text-xs font-PoppinsRegular"
                                                >
                                                    {per?.resposta}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            )),
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default Crediario;
