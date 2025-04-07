import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Animated, { FadeIn } from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootDrawerParamList } from '@screens/RootDrawerPrams';

export default function StatusCashback() {
  const navigation = useNavigation<StackNavigationProp<RootDrawerParamList>>();
  return (
    <Animated.View
      entering={FadeIn}
      className="flex-1 flex items-center justify-center bg-gray-200"
    >
      <Text>StatusCashback</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('CashBack')}
      >
        <Text>Voltar</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}