import {
    View,
    Text,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    TextInput,
    Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AppLayout from '@components/AppLayout';
import {AuthContext} from '@contexts/auth';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootDrawerParamList} from '@screens/RootDrawerPrams';
import AppLoading from '@components/AppLoading';
import {MaterialIcons} from '@expo/vector-icons';
import {Formik} from 'formik';
import {InputStyle, LabelStyle} from '@components/InputStyle';
import serviceapp from '@services/serviceapp';
import schema from './../schema';
import ButtomForm from '@components/ButtomForm';
import Select from '@components/Select';

interface CrediaryForm {
    nomeMae: string;
    sexo: string;
    escolaridade: string;
    localTrabalho: string;
    estadoCivil: string;
    nomeConjuge: string;
    cpfConjuge: string;
    profissao: string;
    renda: string;
}

const Crediary = () => {
    const {setLoading, loading, disconnect, user} = useContext(AuthContext);
    const tokenCli = user?.token;
    const navigation =
        useNavigation<StackNavigationProp<RootDrawerParamList>>();
    const [clientes, setClientes] = useState<any>([]);
    const [sexoSelected, setSexoSelected] = useState<string>('');
    const [escolaridadeSelected, setEscolaridadeSelected] =
        useState<string>('');
    const [estadoCivilSelected, setEstadoCivilSelected] = useState<string>('');
    const [profissaoSelected, setProfissaoSelected] = useState<string>('');
    const [escolaridade, setEscolaridade] = useState<any>([]);
    const [estadoCivil, setEstadoCivil] = useState<any>([]);
    const [profissao, setProfissao] = useState<any>([]);

    useEffect(() => {
        const getClientes = async () => {
            setLoading(true);
            await serviceapp
                .get(`(WS_CARREGA_CLIENTE)?token=${tokenCli}`)
                .then(response => {
                    const {token, message, data} = response.data.resposta;
                    setLoading(false);
                    if (!token) {
                        Alert.alert('Atenção', message, [
                            {
                                text: 'Ok',
                                onPress: () => {
                                    navigation.navigate('Home');
                                    disconnect();
                                },
                            },
                        ]);
                    }
                    setClientes(data);
                    setSexoSelected(data.sexo);
                    setEscolaridadeSelected(data.escolaridade);
                    setEstadoCivilSelected(data.estadoCivil);
                    setProfissaoSelected(data.profissao);
                });
        };
        getClientes();
    }, [tokenCli]);

    // Profissao
    useEffect(() => {
        async function getEscolaridade() {
            await serviceapp
                .get(`(WS_ESCOLARIDADE)`)
                .then(response => {
                    const {data} = response.data.resposta;
                    setEscolaridade(data.map((es: any) => es.escolaridade));
                })
                .catch(erro => {
                    console.log(erro);
                });
        }
        getEscolaridade();
    }, []);

    // Estado civil
    useEffect(() => {
        async function getEstadoCivil() {
            await serviceapp
                .get(`(WS_ESTADO_CIVIL)`)
                .then(response => {
                    const {data} = response.data.resposta;
                    setEstadoCivil(data.map((es: any) => es.estadoCivil));
                })
                .catch(erro => {
                    console.log(erro);
                });
        }
        getEstadoCivil();
    }, []);

    // Profissão
    useEffect(() => {
        async function getProfissao() {
            await serviceapp
                .get(`(WS_PROFISSAO)`)
                .then(response => {
                    const {data} = response.data.resposta;
                    setProfissao(data.map((es: any) => es.profissao));
                })
                .catch(erro => {
                    console.log(erro);
                });
        }
        getProfissao();
    }, []);

    const getSexo = ['Masculino', 'Feminino'];

    // envio do formulário
    const onSubmit = async (values: CrediaryForm) => {
        // Keyboard.dismiss();
        setLoading(true);
        const response = await serviceapp.post(`(WS_CREDIARIO_CLIENTE)`, {
            token: tokenCli,
            nomeMae: values.nomeMae,
            sexo: values.sexo,
            escolaridade: values.escolaridade,
            localTrabalho: values.localTrabalho,
            estadoCivil: values.estadoCivil,
            nomeConjuge: values.nomeConjuge,
            cpfConjuge: values.cpfConjuge,
            profissao: values.profissao,
            renda: values.renda,
        });
        const {token, success, message} = response.data.resposta;
        setLoading(false);
        if (!token) {
            Alert.alert('Atenção', message, [
                {
                    text: 'Ok',
                    onPress: () => {
                        navigation.navigate('Home');
                        disconnect();
                    },
                },
            ]);
        }

        navigation.navigate('LoadImages', {user: tokenCli});
    };

    return (
        <AppLayout>
            <AppLoading visible={loading} />
            <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={75}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 bg-solar-gray-dark px-4">
                        <View className="py-4 flex items-center border-b border-b-gray-300">
                            <Text allowFontScaling={false} className="text-2xl text-solar-blue-dark font-PoppinsMedium mb-4">
                                Crediário
                            </Text>
                            <Text allowFontScaling={false} className="text-base text-solar-blue-dark font-PoppinsRegular mb-4">
                                Preencha o formulário
                            </Text>
                            <View className="flex-row items-center justify-start w-full">
                                <MaterialIcons
                                    name="warning"
                                    size={20}
                                    color={'#f78888'}
                                />
                                <Text allowFontScaling={false} className="text-sm ml-1 text-gray-500">
                                    Todos os dados são obrigatórios
                                </Text>
                            </View>
                        </View>

                        <Formik
                            validationSchema={schema}
                            initialValues={{
                                nomeMae: clientes.nomeMae,
                                sexo: clientes.sexo,
                                escolaridade: clientes.escolaridade,
                                localTrabalho: clientes.localTrabalho,
                                estadoCivil: clientes.estadoCivil,
                                nomeConjuge: clientes.nomeConjuge,
                                cpfConjuge: clientes.cpfConjuge,
                                profissao: clientes.profissao,
                                renda: clientes.renda,
                            }}
                            enableReinitialize
                            onSubmit={onSubmit}
                        >
                            {({
                                handleSubmit,
                                handleBlur,
                                handleChange,
                                values,
                                touched,
                                errors,
                                isValid,
                            }) => (
                                <View className="mt-6">
                                    <View className="mt-6">
                                        <Text allowFontScaling={false} className={LabelStyle}>
                                            Nome da mãe
                                        </Text>
                                        <TextInput
                                            className={InputStyle(
                                                touched.nomeMae,
                                                errors.nomeMae,
                                            )}
                                            autoCapitalize="characters"
                                            value={values.nomeMae}
                                            onBlur={handleBlur('nomeMae')}
                                            onChangeText={handleChange(
                                                'nomeMae',
                                            )}
                                        />
                                        {errors.nomeMae && touched.nomeMae && (
                                            <Text allowFontScaling={false} className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                {errors.nomeMae}
                                            </Text>
                                        )}
                                    </View>

                                    <View className="mt-6">
                                        <Text allowFontScaling={false} className={LabelStyle}>
                                            Gênero
                                        </Text>
                                        <Select
                                            data={getSexo}
                                            onChangeSelect={(id: any) =>
                                                setSexoSelected(id)
                                            }
                                            text="Selecione o gênero"
                                            value={(values.sexo = sexoSelected)}
                                            onchangetext={handleChange('sexo')}
                                            onblur={handleBlur('sexo')}
                                            height="h-64"
                                            showSearch={false}
                                        />

                                        {errors.sexo && touched.sexo && (
                                            <Text allowFontScaling={false} className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                {errors.sexo}
                                            </Text>
                                        )}
                                    </View>

                                    <View className="mt-6">
                                        <Text allowFontScaling={false} className={LabelStyle}>
                                            Escolaridade
                                        </Text>
                                        <Select
                                            data={escolaridade}
                                            onChangeSelect={(id: any) =>
                                                setEscolaridadeSelected(id)
                                            }
                                            text="Selecione a escolaridade"
                                            value={
                                                (values.escolaridade =
                                                    escolaridadeSelected)
                                            }
                                            onchangetext={handleChange(
                                                'escolaridade',
                                            )}
                                            onblur={handleBlur('escolaridade')}
                                            height="h-full"
                                            showSearch={true}
                                        />

                                        {errors.escolaridade &&
                                            touched.escolaridade && (
                                                <Text allowFontScaling={false} className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                    {errors.escolaridade}
                                                </Text>
                                            )}
                                    </View>

                                    <View className="mt-6">
                                        <Text allowFontScaling={false} className={LabelStyle}>
                                            Local de trabalho
                                        </Text>
                                        <TextInput
                                            className={InputStyle(
                                                touched.localTrabalho,
                                                errors.localTrabalho,
                                            )}
                                            autoCapitalize="characters"
                                            value={values.localTrabalho}
                                            onBlur={handleBlur('localTrabalho')}
                                            onChangeText={handleChange(
                                                'localTrabalho',
                                            )}
                                        />
                                        {errors.localTrabalho &&
                                            touched.localTrabalho && (
                                                <Text allowFontScaling={false} className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                    {errors.localTrabalho}
                                                </Text>
                                            )}
                                    </View>

                                    <View className="mt-6">
                                        <Text allowFontScaling={false} className={LabelStyle}>
                                            Estado civil
                                        </Text>
                                        <Select
                                            data={estadoCivil}
                                            onChangeSelect={(id: any) =>
                                                setEstadoCivilSelected(id)
                                            }
                                            text="Selecione o estado civil"
                                            value={
                                                (values.estadoCivil =
                                                    estadoCivilSelected)
                                            }
                                            onchangetext={handleChange(
                                                'estadoCivil',
                                            )}
                                            onblur={handleBlur('estadoCivil')}
                                            height="h-80"
                                            showSearch={false}
                                        />

                                        {errors.estadoCivil &&
                                            touched.estadoCivil && (
                                                <Text allowFontScaling={false} className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                    {errors.estadoCivil}
                                                </Text>
                                            )}
                                    </View>

                                    {estadoCivilSelected === 'Casado' && (
                                        <>
                                            <View className="mt-6">
                                                <Text allowFontScaling={false} className={LabelStyle}>
                                                    Nome do conjuge
                                                </Text>
                                                <TextInput
                                                    className={InputStyle(
                                                        touched.nomeConjuge,
                                                        errors.nomeConjuge,
                                                    )}
                                                    autoCapitalize="characters"
                                                    value={values.nomeConjuge}
                                                    onBlur={handleBlur(
                                                        'nomeConjuge',
                                                    )}
                                                    onChangeText={handleChange(
                                                        'nomeConjuge',
                                                    )}
                                                />
                                                {errors.nomeConjuge &&
                                                    touched.nomeConjuge && (
                                                        <Text allowFontScaling={false} className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                            {errors.nomeConjuge}
                                                        </Text>
                                                    )}
                                            </View>

                                            <View className="mt-6">
                                                <Text allowFontScaling={false} className={LabelStyle}>
                                                    CPF do conjuge
                                                </Text>
                                                <TextInput
                                                    className={InputStyle(
                                                        touched.cpfConjuge,
                                                        errors.cpfConjuge,
                                                    )}
                                                    autoCapitalize="characters"
                                                    value={values.cpfConjuge}
                                                    onBlur={handleBlur(
                                                        'cpfConjuge',
                                                    )}
                                                    onChangeText={handleChange(
                                                        'cpfConjuge',
                                                    )}
                                                />
                                                {errors.cpfConjuge &&
                                                    touched.cpfConjuge && (
                                                        <Text allowFontScaling={false} className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                            {errors.cpfConjuge}
                                                        </Text>
                                                    )}
                                            </View>
                                        </>
                                    )}

                                    <View className="mt-6">
                                        <Text allowFontScaling={false} className={LabelStyle}>
                                            Profissão
                                        </Text>
                                        <Select
                                            data={profissao}
                                            onChangeSelect={(id: any) =>
                                                setProfissaoSelected(id)
                                            }
                                            text="Selecione a profissão"
                                            value={
                                                (values.profissao =
                                                    profissaoSelected)
                                            }
                                            onchangetext={handleChange(
                                                'profissao',
                                            )}
                                            onblur={handleBlur('profissao')}
                                            height="h-full"
                                            showSearch={true}
                                        />
                                        {errors.profissao &&
                                            touched.profissao && (
                                                <Text allowFontScaling={false} className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                    {errors.profissao}
                                                </Text>
                                            )}
                                    </View>

                                    <View className="mt-6">
                                        <Text allowFontScaling={false} className={LabelStyle}>
                                            Renda
                                        </Text>
                                        <TextInput
                                            className={InputStyle(
                                                touched.renda,
                                                errors.renda,
                                            )}
                                            autoCapitalize="characters"
                                            value={values.renda}
                                            onBlur={handleBlur('renda')}
                                            onChangeText={handleChange('renda')}
                                        />
                                        {errors.renda && touched.renda && (
                                            <Text allowFontScaling={false} className="self-end pr-1 pt-1 text-xs text-red-600 font-PoppinsRegular">
                                                {errors.renda}
                                            </Text>
                                        )}
                                    </View>

                                    <View className="my-6">
                                        <ButtomForm
                                            isValid={isValid}
                                            title="Continuar"
                                            onPress={handleSubmit}
                                        />
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </AppLayout>
    );
};

export default Crediary;
