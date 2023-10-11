import {View, Text, Alert} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AppLayout from '@components/AppLayout';
import AppLoading from '@components/AppLoading';
import {AuthContext} from '@contexts/auth';
import {TouchableOpacity} from 'react-native-gesture-handler';
import serviceapp from '@services/serviceapp';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {RootDrawerParamList} from '@screens/RootStackPrams';
import {MaterialIcons} from '@expo/vector-icons';
import MoneyPTBR from '@components/MoneyPTBRSimbol';
import {FlashList} from '@shopify/flash-list';
import {ListStyle} from '@components/InputStyle';
import ButtonPayament from '@components/ButtonPayament';

const OpenPayments = () => {
    const {loading, setLoading, user, disconnect} = useContext(AuthContext);
    const navigation =
        useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
    const isFocused = useIsFocused();
    const [crediarios, setCrediarios] = useState<any>([]);
    const [showModalParcelas, setShowModalParcelas] = useState(false);
    const [isAllChecked, setAllChecked] = useState(false);
    const [arrayIndex, setArrayIndex] = useState<any>([]);
    const [arrayValues, setArrayValues] = useState<any>([]);
    const [arrayTotals, setArrayTotals] = useState<any>([]);

    useEffect(() => {
        const getCrediarios = async () => {
            setLoading(true);

            await serviceapp
                .get(`(WS_CARREGA_CREDIARIO)?token=${user?.token}`)
                .then(response => {
                    const {message, token, data} = response.data.resposta;
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
                    setCrediarios(data.aberto);
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => setLoading(false));
        };
        if (isFocused) {
            getCrediarios();
        }
    }, [user, isFocused]);

    const handleSelectAll = () => {
        const lengthCred = crediarios.filter(
            (s: any) => s.status !== 'P',
        ).length;
        if (!isAllChecked) {
            arrayIndex.splice(0, arrayIndex.length);
            arrayValues.splice(0, arrayValues.length);
            arrayTotals.splice(0, arrayTotals.length);
            let indexSelecteds = [...arrayIndex];
            let valueSelecteds = [...arrayValues];
            let totalSelecteds = [...arrayTotals];
            for (let index = 0; index < lengthCred; index++) {
                let valPag = crediarios
                    .filter((v: any, i: number) => i === index)
                    .map((vp: any) => vp.total);
                let valTot = crediarios
                    .filter((v: any, i: number) => i === index)
                    .map((vp: any) => ({
                        numeroCarne: vp.numeroCarne,
                        filial: vp.filial,
                        parcela: parseInt(vp.parcela.slice(0, 2)),
                        vencimento: vp.vencimento,
                        atraso: vp.atraso,
                        vlprest: vp.vlprest,
                        acrescimo: vp.acrescimo,
                        total: vp.total,
                        status: vp.status,
                        urlBoleto: vp.urlBoleto,
                    }));
                indexSelecteds.push(index);
                valueSelecteds.push(parseFloat(valPag));
                totalSelecteds.push(...valTot);
            }
            setArrayIndex(indexSelecteds);
            setArrayValues(valueSelecteds);
            setArrayTotals(totalSelecteds);
            setAllChecked(true);
            setShowModalParcelas(true);
        } else {
            setArrayIndex([]);
            setArrayValues([]);
            setArrayTotals([]);
            setAllChecked(false);
            setShowModalParcelas(false);
        }
    };

    const handleSelectOne = (id: any) => {
        const index = arrayIndex.findIndex((i: number) => i === id);
        const lengthCred = crediarios.filter(
            (s: any) => s.status !== 'P',
        ).length;

        let valPag = crediarios
            .filter((v: any, i: number) => i === id)
            .map((vp: any) => vp.total);
        let valTot = crediarios
            .filter((v: any, i: number) => i === id)
            .map((vp: any) => ({
                numeroCarne: vp.numeroCarne,
                filial: vp.filial,
                parcela: parseInt(vp.parcela.slice(0, 2)),
                vencimento: vp.vencimento,
                atraso: vp.atraso,
                vlprest: vp.vlprest,
                acrescimo: vp.acrescimo,
                total: vp.total,
                status: vp.status,
                urlBoleto: vp.urlBoleto,
            }));

        let indexSelecteds = [...arrayIndex];
        let valueSelecteds = [...arrayValues];
        let totalSelecteds = [...arrayTotals];
        ('');
        if (index !== -1) {
            indexSelecteds.splice(index, 1);
            valueSelecteds.splice(index, 1);
            totalSelecteds.splice(index, 1);
            setAllChecked(false);
            if (arrayIndex.length < 2) {
                setShowModalParcelas(false);
            }
        } else {
            if (arrayIndex.length + 1 === lengthCred) {
                setAllChecked(true);
            }
            indexSelecteds.push(id);
            totalSelecteds.push(...valTot);
            valueSelecteds.push(parseFloat(valPag));
            setShowModalParcelas(true);
        }
        setArrayIndex(indexSelecteds);
        setArrayValues(valueSelecteds);
        setArrayTotals(totalSelecteds);
    };

    const RenderItem = ({idx, crediario}: any) => {
        return (
            <TouchableOpacity
                key={idx}
                onPress={() => handleSelectOne(idx)}
                className={`flex-row items-center justify-between bg-solar-gray-light my-1 ${ListStyle} py-4 `}
                disabled={crediario.status === 'P' ? true : false}
            >
                <View className="flex-row items-center justify-center w-full">
                    <View className="flex-none items-center justify-start w-8">
                        {crediario.status === 'P' ? (
                            <MaterialIcons
                                name="schedule"
                                size={28}
                                color={'#ffaf64'}
                            />
                        ) : (
                            <View
                                className={`h-6 w-6 border-2 border-solar-yellow-dark ${
                                    arrayIndex.length > 0 &&
                                    arrayIndex.includes(idx)
                                        ? 'bg-solar-yellow-dark'
                                        : 'bg-transparent'
                                }  flex items-center justify-center rounded-full`}
                            >
                                {arrayIndex.length > 0 &&
                                    arrayIndex.findIndex(
                                        (i: any) => i === idx,
                                    ) !== -1 && (
                                        <MaterialIcons
                                            name="check"
                                            size={22}
                                            color="white"
                                        />
                                    )}
                            </View>
                        )}
                    </View>
                    <View className="flex-1 flex-col items-start">
                        <View className="flex-row">
                            <View className="flex-1 pl-2">
                                <Text className="text-sm font-PoppinsRegular pb-1">
                                    Número do contrato
                                </Text>
                                <Text className="text-sm font-PoppinsMedium">
                                    {crediario.numeroCarne}
                                </Text>
                                <Text className="text-xs font-PoppinsRegular">
                                    {crediario.vencimento}
                                </Text>
                                <Text className="text-sm font-PoppinsRegular pt-1">
                                    Parcela{' '}
                                    {crediario.parcela.replace('/', ' de ')}
                                </Text>
                            </View>
                            <View className="flex-1">
                                <View
                                    className={`${
                                        crediario.status === 'P'
                                            ? 'bg-solar-orange-dark'
                                            : crediario.atraso > 0
                                            ? 'bg-solar-yellow-light'
                                            : ''
                                    }  rounded-md flex items-center justify-center mb-1 ml-4`}
                                >
                                    <Text
                                        className={`text-xs font-PoppinsRegular ${
                                            crediario.status === 'P'
                                                ? 'text-white'
                                                : 'text-white'
                                        }`}
                                    >
                                        {crediario.status === 'P'
                                            ? 'Processando'
                                            : crediario.atraso > 0
                                            ? 'Atrasada'
                                            : ''}
                                    </Text>
                                </View>
                                <View
                                    className={`flex-col items-end justify-around ${
                                        crediario.acrescimo > 0 ? '' : 'mt-4'
                                    }`}
                                >
                                    <Text className="text-base text-gray-400 font-PoppinsRegular">
                                        Valor:{' '}
                                        {MoneyPTBR(
                                            parseFloat(crediario.vlprest),
                                        )}
                                    </Text>
                                    {crediario.acrescimo > 0 && (
                                        <Text className="text-xs text-red-500 font-PoppinsRegular">
                                            Juros:{' '}
                                            {MoneyPTBR(
                                                parseFloat(crediario.acrescimo),
                                            )}
                                        </Text>
                                    )}
                                    <Text className="text-lg font-PoppinsBold text-solar-blue-dark">
                                        {MoneyPTBR(parseFloat(crediario.total))}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const ModalParcelas = () => {
        return (
            <View
                className={`absolute bg-solar-blue-dark z-50 left-0 right-0 bottom-0 transition-all ease-in-out duration-300 ${
                    showModalParcelas ? 'opacity-100' : 'opacity-0'
                }`}
            >
                <View className="flex-row">
                    <View className="flex-1 flex-col pl-4 pt-8">
                        <View className="flex-row items-center">
                            <Text className="text-gray-100 text-base">
                                Total:{' '}
                            </Text>
                            <Text className="text-white text-lg font-PoppinsBold">
                                {MoneyPTBR(
                                    arrayValues.reduce(
                                        (soma: any, value: any) => {
                                            return soma + value;
                                        },
                                        0,
                                    ),
                                )}
                            </Text>
                        </View>
                        <Text className="text-gray-100 text-base mt-2">
                            {arrayIndex.length} parcelas
                        </Text>
                    </View>
                    <View className="flex-none">
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Methods', {
                                    order: {
                                        dataOrder: arrayTotals,
                                        valueTotal: arrayValues.reduce(
                                            (soma: any, value: any) => {
                                                return soma + value;
                                            },
                                            0,
                                        ),
                                    },
                                });
                                setArrayIndex([]);
                                setArrayValues([]);
                                setArrayTotals([]);
                                setAllChecked(false);
                                setShowModalParcelas(false);
                            }}
                            className="bg-solar-orange-middle rounded-md py-4 my-10 mr-4 items-center px-8"
                        >
                            <Text className="text-lg font-PoppinsMedium text-solar-blue-dark">
                                PAGAR
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <AppLayout>
            <AppLoading visible={loading} />
            <View className="flex-1 items-center justify-start bg-solar-gray-dark px-4">
                <View className="flex-col items-center justify-center mb-4">
                    <Text className="text-3xl text-solar-blue-dark py-4">
                        Meus pagamentos
                    </Text>
                </View>

                <View className="flex-row items-center justify-between w-full">
                    <View className="flex-1 pr-2">
                        <ButtonPayament
                            bgclassname="bg-solar-blue-dark"
                            txcolor="text-white"
                            onpress={undefined}
                            label={'Em aberto'}
                        />
                    </View>

                    <View className="flex-1 pl-2">
                        <ButtonPayament
                            bgclassname="bg-solar-gray-dark"
                            txcolor="text-solar-blue-dark"
                            onpress={() =>
                                navigation.navigate('HistoryPayments')
                            }
                            label={'Histórico'}
                        />
                    </View>
                </View>
                <View className="w-full py-6">
                    <TouchableOpacity
                        className="flex-row items-center justify-start"
                        onPress={() => handleSelectAll()}
                    >
                        <View
                            className={`h-6 w-6 flex-row items-center justify-center rounded-full border-2 border-solar-yellow-dark ${
                                isAllChecked
                                    ? 'bg-solar-yellow-dark'
                                    : 'bg-transparent'
                            }`}
                        >
                            {isAllChecked && (
                                <MaterialIcons
                                    name="check"
                                    size={22}
                                    color="white"
                                />
                            )}
                        </View>
                        <Text className="ml-2 text-base font-PoppinsRegular text-solar-yellow-dark">
                            Selecionar todos
                        </Text>
                    </TouchableOpacity>
                </View>

                {crediarios && (
                    <View className="flex-1 w-full h-full pb-2">
                        <FlashList
                            data={crediarios}
                            renderItem={({item, index}) => (
                                <RenderItem crediario={item} idx={index} />
                            )}
                            estimatedItemSize={50}
                            keyExtractor={(item: any, index) =>
                                item.filial + index
                            }
                            ItemSeparatorComponent={() => (
                                <View className="h-0.5 bg-solar-gray-darkr" />
                            )}
                            extraData={arrayIndex}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                )}
                {showModalParcelas && <ModalParcelas />}
            </View>
        </AppLayout>
    );
};

export default OpenPayments;
