import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import StackRoutes from '../routes/stack.routes';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DisponibilizarRifas from '../pages/DisponibilizarRifas';
import MinhasRifasEBilhetes from '../pages/MinhasRifasEBilhetes';
import Pesquisar from '../pages/Pesquisar';
import Perfil from '../pages/Perfil';

const Tab = createBottomTabNavigator();

console.log('routes/app.routes.js');

function AppRoutes() {
  return (

    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarStyle: {
          backgroundColor: '#000'
        }
      }}
    >
      <Tab.Screen
        name='HomeStack' component={StackRoutes}
        options={{
          headerShown: false,
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => {
            return <Feather
              name='home' color={color} size={size}
            />
          }
        }}
      />
      <Tab.Screen
        name='DisponibilizarRifas' component={DisponibilizarRifas}
        options={{
          headerShown: false,
          tabBarLabel: 'Criar Rifas',
          tabBarIcon: ({ color, size }) => {
            return <MaterialCommunityIcons
              name='book-plus-outline' color={color} size={size}
            />
          }
        }}
      />
      <Tab.Screen
        name='Pesquisar' component={Pesquisar}
        options={{
          headerShown: false,
          tabBarLabel: 'Pesquisar',
          tabBarIcon: ({ color, size }) => {
            return <MaterialCommunityIcons
              name='book-search-outline' color={color} size={size}
            />
          }
        }}
      />
      <Tab.Screen
        name='MinhasRifasEBilhetes' component={MinhasRifasEBilhetes}
        options={{
          headerShown: false,
          tabBarLabel: 'Minhas Rifas',
          tabBarIcon: ({ color, size }) => {
            return <MaterialCommunityIcons
              name='bookmark-check-outline' color={color} size={size}
            />
          }
        }}
      />
      <Tab.Screen
        name='Perfil' component={Perfil}
        options={{
          headerShown: false,
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => {
            return <Feather
              name='user' color={color} size={size}
            />
          }
        }}
      />
    </Tab.Navigator>
  )
}

export default AppRoutes;