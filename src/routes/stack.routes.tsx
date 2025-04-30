import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Cashback from '@screens/CashBack';
import HistoricoCashback from '@screens/CashBack/HistoricoCashback';
import React from 'react'

export default function StackRoutes() {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
    screenOptions={{
        presentation:'transparentModal',
        animation: 'slide_from_bottom'
    }}
    >
      <Stack.Screen
      name='Home'
      component={Cashback}
      options={{
        headerShown: false
      }}
      />
      <Stack.Screen
      name='HistoricoCashback'
      component={HistoricoCashback}
      options={{
        headerShown: false
      }}
      />
    </Stack.Navigator>
  )
}