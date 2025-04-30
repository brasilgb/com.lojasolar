import { View, Text, TouchableOpacity, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
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

export default function Cashback() {
  const { loading, setLoading, user, disconnect } = useContext(AuthContext);
  const [historicoCashback, setHisoricoCashback] = useState<any>([]);
  const navigation = useNavigation<StackNavigationProp<RootDrawerParamList>>();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
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
          setHisoricoCashback(response.data.respcash.data);
        })
        .catch((error) => {
          console.log('error', error);
        }).finally(() => setLoading(false));
    };
    getHistoricoCashback();
  }, []);

  const MyList = () => {
    return (
      <FlashList
        data={historicoCashback}
        renderItem={({ item }: any) => <Text>{item.valor}</Text>}
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
        <View className="flex-col items-center justify-center mb-4">
          <Text
            allowFontScaling={false}
            className="text-2xl text-solar-blue-dark py-4"
          >
            Histórico de cashback
          </Text>
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
          <MyList />
        </View>
      </View>
      <TouchableOpacity
        className={`flex items-center justify-center mb-4 border-2 border-white bg-solar-orange-middle ${Platform.OS == 'ios'
          ? 'shadow-sm shadow-gray-300'
          : 'shadow-sm shadow-black'
          } py-3 rounded-full`}
        onPress={() => navigation.navigate('HistoricoCashback')}
      >
        <Text
          className={`text-lg font-PoppinsMedium self-center text-solar-blue-dark
            }`}
        >
          Solicitar cashback
        </Text>
      </TouchableOpacity>
    </AppLayout>
  )
}