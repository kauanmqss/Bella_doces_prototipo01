import { Text, View, Image } from 'react-native';
import { useState } from 'react'
import { Button, TextInput } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AdminScreen from './admin';
import styles from './styles';



function LojaHome ({ navigation }) { {/* Função da tela da Loja */}
  return (
    <View style={styles.container}> {/* Container da página da Loja  */}
      <Text style={styles.titulo}>Bem-vindo à loja!</Text>
      <Text style={styles.titulo}>Coloque os itens aqui (apagar depois de colocar)</Text> {/* Apagar depois de colocar os itens */}
    </View>
  );
}

function RelatorioScreen() {
  return (
    <View style={styles.container}> {/* Container da página da Loja  */}
      <Text style={styles.titulo}>Relatórios</Text>
    </View>
  );
}

function VendasScreen() {
  return(
    <View style={styles.container}> {/* Container da página da Loja  */}
      <Text style={styles.titulo}>Vendas</Text>
    </View>
  );
}


const Drawer = createDrawerNavigator();


export default function LojaScreen() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#331D26' },
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#FADEEA', width: 220 },
        drawerActiveTintColor: '#D6337F',
        drawerLabelStyle: { fontSize: 16 },
    }}

    drawerContent={(props) => (
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex:1 }}>
        <DrawerItemList {...props} />

        <View style={{flex: 1 }} />

        <View style={{ padding: 16 }}>
          <Button
            mode='contained'
            style={styles.botaoMenu}
            labelStyle={{ fontFamily: 'Montserrat-Bold' }}
            color="#D6337F"
            onPress={() => props.navigation.navigate('Login')}
          >
          Sair
          </Button>
        </View>
      </DrawerContentScrollView>
    )}
  >
      
    <Drawer.Screen name="Página Inicial" component={LojaHome} />
    <Drawer.Screen name="Relatórios" component={RelatorioScreen} />
    <Drawer.Screen name="Vendas" component={VendasScreen} />
  </Drawer.Navigator> 
  );
}
