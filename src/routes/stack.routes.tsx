import { createNativeStackNavigator } from '@react-navigation/native-stack'
import StatusCashback from '@screens/CashBack/StatusCashBack';
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
      component={StatusCashback}
      options={{
        headerShown: false
      }}
      />
    </Stack.Navigator>
  )
}