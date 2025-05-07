import { View, Text, TouchableOpacity, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootDrawerParamList } from '@screens/RootDrawerPrams';
import moment from 'moment';
import AppLayout from '@components/AppLayout';
import AppLoading from '@components/AppLoading';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '@contexts/auth';
import { FlashList } from '@shopify/flash-list';
import serviceapp from '@services/serviceapp';
import MoneyPTBR from '@components/MoneyPTBRSimbol';

export default function CashBack() {
  const { loading, setLoading, user, disconnect } = useContext(AuthContext);
  const [historicoCashback, setHisoricoCashback] = useState<any>([]);
  const navigation = useNavigation<StackNavigationProp<RootDrawerParamList>>();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const isFocused = useIsFocused();
  const datePrev = moment().add(-1, 'days').format('DD');
  const [dateIni, setDateIni] = useState<any>(
    moment().add(-datePrev, 'days'),
  );
  const [dateFin, setDateFin] = useState<any>(new Date());

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
        "codcli": 342955,
        "dataInicial": 20241119,
        "dataFinal": 20241130
      })
        .then((response) => {
          setHisoricoCashback(response.data.respcash);
        })
        .catch((error) => {
          console.log('error', error);
        }).finally(() => setLoading(false));
    };
    if (isFocused) {
      getHistoricoCashback();
    }
  }, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity className='border border-gray-500 rounded py-2 px-2 my-2 bg-solar-blue-light'>
      <View className='flex-row justify-between'>
        <Text className='text-white'>Série: {item.serie}</Text>
        <Text className='text-white'>NF: {item.numnf}</Text>
        <Text className='text-white'>Itens: {item.itens}</Text>
        <Text className='text-white'>Valor: {item.valor}</Text>
      </View>
    </TouchableOpacity>
  );

  const CashbackList = () => {
    return (
      <FlashList
        data={historicoCashback.data}
        renderItem={renderItem}
        estimatedItemSize={200}
      />
    );
  };

  return (
    <AppLayout classname="bg-solar-gray-dark p-4">
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
            <Text className={`text-2xl ${historicoCashback.credTotal > 0 ? 'text-sky-800' : 'text-red-500'} font-semibold`}>{MoneyPTBR((typeof historicoCashback.credTotal === 'undefined') ? 0 : historicoCashback.credTotal)}</Text>
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
        className={`flex items-center justify-center mb-4 border-2 border-white bg-solar-orange-middle ${Platform.OS == 'ios'
          ? 'shadow-sm shadow-gray-300'
          : 'shadow-sm shadow-black'
          } py-3 rounded-full`}
        onPress={() => navigation.navigate('HistoricoCashback', { cred: historicoCashback.credTotal })}
      >
        <Text
          className={`text-lg font-PoppinsMedium self-center text-solar-blue-dark
            }`}
        >
          Acessar pedidos
        </Text>
      </TouchableOpacity>
    </AppLayout>
  )
}