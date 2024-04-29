import { View, Text, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from "@contexts/auth"
import AppLayout from "@components/AppLayout";
import AppLoading from "@components/AppLoading";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootDrawerParamList } from "@screens/RootDrawerPrams";
import { TouchableOpacity } from "react-native-gesture-handler";
import docscanner from "@services/docscanner";

const DocsAssign = () => {
  const { user, setLoading, loading } = useContext(AuthContext);
  const navigation = useNavigation<StackNavigationProp<RootDrawerParamList>>();
  const [assignDocs, setAssignDocs] = useState<any>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const getAssignDocs = async () => {
      setLoading(true);
      await docscanner.post('(WS_SIGNATURES_BY_CUSTOMER)', {
          code: user?.codigoCliente
        })
        .then((res) => {
          const { signatures } = res.data.response;
          if(signatures === undefined){
            setAssignDocs([]);
            return;
          }
          setAssignDocs(signatures);
        })
        .catch((err) => {
          console.log(err);
        }).finally(() => setLoading(false))
    };
    if (isFocused) {
      getAssignDocs();
    }
  }, [user, isFocused])

  return (
    <AppLayout>
      <AppLoading visible={loading} />
      <View className="flex-1 items-center justify-start bg-solar-gray-dark px-2">
        <View className="flex-col items-center justify-center">
          <Text allowFontScaling={false} className="text-3xl text-solar-blue-dark py-4">
            Assinatura de documentos
          </Text>
          <Text allowFontScaling={false} className="text-base text-solar-blue-dark font-PoppinsRegular mb-4 px-8 text-center">
            Documentos disponíveis
          </Text>
        </View>
        <View className="flex-col items-center justify-center w-full px-2">
          {!assignDocs &&
            <View className="bg-solar-blue-light py-2 px-4 rounded">
              <Text className="text-sm text-solar-gray-light">Não há documentos a serem assinados</Text>
            </View>
          }
          {assignDocs && assignDocs.map((doc: any, idx: number) => (
            <View key={idx} className="w-full bg-gray-50 rounded-md shadow-md shadow-black p-2 mb-3">
              <View className="flex-row items-center justify-between mb-2 bg-gray-100">
                <Text className="text-sm font-bold">Data: {doc.date}</Text>
                <Text className="text-sm font-bold">NF: {doc.number}</Text>
                <Text className="text-sm font-bold">Filial: {doc.origin}</Text>
                <Text className="text-sm font-bold">Série: {doc.serie}</Text>
              </View>
              <View>
                <Text className="text-sm font-bold  text-solar-blue-dark">Documento: {doc.link}</Text>
              </View>
              <View className="flex-row items-center justify-end mt-2">
                <TouchableOpacity
                  onPress={() => navigation.navigate('ViewDoc', { data: doc.link })}
                  className="bg-solar-orange-middle py-1 px-2 rounded"
                >
                  <Text className="text-xs text-solar-blue-dark font-bold uppercase">Assinar documento</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

      </View>
    </AppLayout>
  )
}

export default DocsAssign