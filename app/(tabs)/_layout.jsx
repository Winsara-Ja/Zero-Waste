import { StyleSheet, Text, View, Image } from 'react-native'
import { Tabs } from 'expo-router'
import React from 'react'

import { icons } from '../../constants'

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-1">
      <Image
        source={icon}
        tintColor={color}
        resizeMode='contain'
        className="w-7 h-7"
      />
      <Text className={`${focused ? 'font-bold' : 'font-normal'} text-xs`}>
        {name}
      </Text>
    </View>
  )
}

const TabsLayout = () => {

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: 'green',
          tabBarStyle: {
            height: 70
          }
        }
        }
      >
        <Tabs.Screen name="home" options={
          {
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused} />
            )
          }
        } />
        <Tabs.Screen name="garbage" options={
          {
            title: 'Garbage',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.recycleBin}
                color={color}
                name="Garbage"
                focused={focused} />
            )
          }
        } />
        <Tabs.Screen name="profile" options={
          {
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused} />
            )
          }
        } />
      </Tabs>
    </>
  )
}

export default TabsLayout