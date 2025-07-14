import { View, Text, TouchableOpacity, Platform, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootDrawerParamList } from '@screens/RootDrawerPrams';
import moment from 'moment';
import AppLayout from '@components/AppLayout';
import AppLoading from '@components/AppLoading';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '@contexts/auth';
import { FlashList } from '@shopify/flash-list';
import serviceapp from '@services/serviceapp';
import MoneyPTBR from '@components/MoneyPTBRSimbol';
import { maskMoney } from '@components/masks';
import ListItemsModal from '@components/ListItemsModal';

export default function CashBack() {
  const { loading, setLoading, user, disconnect } = useContext(AuthContext);
  const [historicoCashback, setHisoricoCashback] = useState<any>([]);
  const navigation = useNavigation<StackNavigationProp<RootDrawerParamList>>();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const isFocused = useIsFocused();
  // const datePrev = moment().add(-6, 'month').format('MM');
  let dataAtual = new Date();
  let dataAnterior = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 6, dataAtual.getDate());
  const [dateIni, setDateIni] = useState<any>(dataAnterior);
  const [dateFin, setDateFin] = useState<any>(new Date());
  const [modalVisible, setModalVisible] = useState<any>(false);
  const [modalData, setModalData] = useState<any>([]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    setDateIni(date);
    hideDatePicker();
  };

  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
  };

  const hideDatePicker2 = () => {
    setDatePickerVisibility2(false);
  };

  const handleConfirm2 = (date: any) => {
    setDateFin(date);
    hideDatePicker2();
  };

  useEffect(() => {
    const getHistoricoCashback = async () => {
      setLoading(true);
      await serviceapp.post('(WS_CONSULTA_CASHBACK)', {
        "codcli": user?.codigoCliente,
        "dataInicial": moment(dateIni).format("YYYYMMDD"),
        "dataFinal": moment(dateFin).format("YYYYMMDD")
      })
        .then((response) => {
          setHisoricoCashback(response.data.respcash);
        })
        .catch((error) => {
          console.log('error', error);
        })
        .finally(() => setLoading(false));
    };
    if (isFocused) {
      getHistoricoCashback();
    }
  }, [user, dateIni, dateFin, isFocused]);

  const handleHistoricoCachback = () => {
    setDateIni(dataAnterior);
    setDateFin(new Date())
    navigation.navigate('HistoricoCashback', { cred: historicoCashback })
  }


  const actionModal = (item: any) => {
    setModalVisible(true);
    setModalData(item);
  }

  const renderItem = ({ item }: any) => (
    <Pressable
      onPress={() => actionModal(item)}
      className='flex-1 m-1 rounded-md bg-solar-blue-light py-0.5 px-2 my-1'
      style={{ maxWidth: '100%' }}
    >
      <View className='flex-row items-center justify-between'>
        <Entypo name='text-document' size={24} color='white' />
        <Text className='text-white border-r border-white/20 pr-1.5 py-3'>Sér: {item.serie}</Text>
        <Text className='text-white border-r border-white/20 pr-1.5 py-3'>NF: {item.numnf}</Text>
        <Text className='text-white border-r border-white/20 pr-1.5 py-3'>Orig: {item.orige}</Text>
        <Text className='text-white'>Val: {maskMoney(`${item.valor}`)}</Text>
      </View>
    </Pressable>
  );

  const CashbackList = () => {
    return (
      <FlashList
        data={historicoCashback.data}
        renderItem={renderItem}
        estimatedItemSize={100}
        numColumns={1}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    );
  };

  return (
    <AppLayout classname="bg-solar-gray-dark">
      <AppLoading visible={loading} />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible2}
        mode="date"
        onConfirm={handleConfirm2}
        onCancel={hideDatePicker2}
      />
      <View className='flex-1 px-4'>
        <View className="flex-1 items-center justify-start bg-solar-gray-dark">
          <View className="flex-col items-center justify-center">
            <Text
              allowFontScaling={false}
              className="text-2xl text-solar-blue-dark py-4"
            >
              Histórico de cashback
            </Text>
          </View>
          <View className=' bg-white flex-row items-center justify-center rounded-lg px-4 py-2 shadow-sm shadow-slate-950'>
            <Text className='text-lg font-semibold mr-4'>Saldo disponível</Text>
            <View className={` flex items-center justify-center`}>
              <Text className={`text-2xl ${historicoCashback?.data?.length > 0 ? 'text-sky-800' : 'text-red-500'} font-semibold`}>{MoneyPTBR(historicoCashback?.data?.length > 0 ? historicoCashback?.credTotal : 0)}</Text>
            </View>
          </View>
          <View className="flex-row items-center justify-between w-full my-4">
            <View className="flex-1 pr-2">
              <Text
                allowFontScaling={false}
                className="text-sm font-PoppinsMedium text-gray-500 mb-1"
              >
                Data Inicial
              </Text>
              <TouchableOpacity
                onPress={showDatePicker}
                className={`flex-row items-center justify-between bg-solar-gray-dark border-2 border-white rounded-lg py-2 pl-2 shadow-sm ${Platform.OS === 'ios'
                  ? 'shadow-gray-300'
                  : 'shadow-gray-400'
                  }`}
              >
                <Text
                  allowFontScaling={false}
                  className="text-base text-solar-blue-dark font-PoppinsMedium"
                >
                  {moment(dateIni).format('DD/MM/YYYY')}
                </Text>
                <MaterialCommunityIcons
                  name="calendar-month"
                  size={28}
                  color="#F99F1E"
                />
              </TouchableOpacity>
            </View>

            <View className="flex-1 pl-2">
              <Text
                allowFontScaling={false}
                className="text-sm font-PoppinsMedium text-gray-500 mb-1"
              >
                Data Final
              </Text>
              <TouchableOpacity
                onPress={showDatePicker2}
                className={`flex-row items-center justify-between bg-solar-gray-dark border-2 border-white rounded-lg py-2 pl-2 shadow-sm ${Platform.OS === 'ios'
                  ? 'shadow-gray-300'
                  : 'shadow-gray-400'
                  }`}
              >
                <Text
                  allowFontScaling={false}
                  className="text-base text-solar-blue-dark font-PoppinsMedium"
                >
                  {moment(dateFin).format('DD/MM/YYYY')}
                </Text>
                <MaterialCommunityIcons
                  name="calendar-month"
                  size={28}
                  color="#F99F1E"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View className='flex-1 w-full'>
            <CashbackList />
          </View>

        </View>
        <TouchableOpacity
          className={`flex items-center justify-center mb-4 border-2 border-white
          ${historicoCashback?.data?.length > 0 ? 'bg-solar-orange-middle' : 'bg-solar-gray-dark'}  ${Platform.OS == 'ios'
              ? 'shadow-sm shadow-gray-300'
              : 'shadow-sm shadow-black'
            } py-3 rounded-full`}
          onPress={() => handleHistoricoCachback()}
          disabled={historicoCashback?.data?.length > 0 ? false : true}
        >
          <Text
            className={`text-lg font-PoppinsMedium self-center
            ${historicoCashback?.data?.length > 0 ? 'text-solar-blue-dark' : 'text-gray-400'} 
            }`}
          >
            Solicitar cashback
          </Text>
        </TouchableOpacity>
      </View>
      <ListItemsModal visible={modalVisible} onRequestClose={() => setModalVisible(false)} modalData={modalData} />
    </AppLayout>
  )
}