import React, { useState, useContext } from 'react';
import { View, Text, FlatList, Image, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import styles from './styles';
import { ItemContext } from './ItemContext';

// Tema reutilizável para inputs
const inputTheme = {
  fonts: { regular: { fontFamily: 'Montserrat-Regular' } },
  roundness: 30,
  colors: {
    primary: '#d6337f', // borda rosa ao focar
    text: '#000',
    placeholder: '#999',
  },
};



// ---------- TELA DE CADASTRO ----------
export function AdminScreen() {
  const { itens, setItens } = useContext(ItemContext);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState('');
  

  const cadastrarItem = () => {
    if (!nome.trim() || !preco.trim() || !imagem.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const novoItem = {
      id: Date.now().toString(),
      nome,
      preco,
      imagem,
      status: 'Disponível',
      quantidade: 0,
    };

    Alert.alert('Sucesso!', 'Produto cadastrado com sucesso!')

    setItens([...itens, novoItem]);
    setNome('');
    setPreco('');
    setImagem('');
  };

  const excluirItem = (id) => {
    Alert.alert(
      'Excluir Item',
      'Tem certeza que deseja excluir esse item ?',
      [
        { text: 'cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: () => {
            setItens(itens.filter((item) => item.id !== id));
          },
          style: 'destructive',
        },
      ]
    );
    setItens(itens.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastrar Novo Item</Text>

      <TextInput
        placeholder="Nome do item"
        style={styles.inputs}
        theme={inputTheme}
        mode="outlined"
        value={nome}
        onChangeText={setNome}
        outlineColor='transparent'
        activeOutlineColor='#6200ee'
      />
      <TextInput
        placeholder="Preço (R$)"
        style={styles.inputs}
        theme={inputTheme}
        mode="outlined"
        keyboardType="numeric"
        value={preco}
        onChangeText={setPreco}
        outlineColor='transparent'
        activeOutlineColor='#6200ee'
      />
      <TextInput
        placeholder="URL da imagem"
        style={styles.inputs}
        theme={inputTheme}
        mode="outlined"
        value={imagem}
        onChangeText={setImagem}
        outlineColor='transparent'
        activeOutlineColor='#6200ee'
      />


      <Button mode="contained"
      onPress={cadastrarItem}
      labelStyle={{ fontFamily: 'Montserrat-Regular' }}
      color="#d6337f"
      style={styles.botoes}>
        Adicionar Item
      </Button>
    </View>
  );
}

// ---------- TELA DE RELATÓRIO ----------
function RelatorioScreen() {
  const { itens, setItens } = useContext(ItemContext);

  const totalItens = itens.length;
  const totalPreco = itens.reduce((acc, item) => acc + parseFloat(item.preco || 0), 0);


   const excluirItem = (id) => {
    Alert.alert(
      'Excluir Item',
      'Tem certeza que deseja excluir esse item ?',
      [
        { text: 'cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: () => {
            setItens(itens.filter((item) => item.id !== id));
          },
          style: 'destructive',
        },
      ]
    );
    setItens(itens.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Relatório de Itens</Text>

      <Text style={{ marginTop: 10, fontSize: 18 }}>
        Total de itens: {totalItens}
      </Text>
      <Text style={{ fontSize: 18 }}>
        Soma de preços: R$ {totalPreco.toFixed(2)}
      </Text>

      {itens.length === 0 ? (
        <Text style={{ marginTop: 20, fontSize: 18 }}>Nenhum item cadastrado.</Text>
      ) : (
        <FlatList
          data={itens}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ marginTop: 20, alignItems: 'center', }}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: '#FFE6F0',
                borderRadius: 10,
                padding: 10,
                marginBottom: 10,
                alignItems: 'center',
                width: 250,
              }}
            >
              <Image
                source={{ uri: item.imagem }}
                style={{ width: 80, height: 80, borderRadius: 10 }}
              />
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.nome}</Text>
              <Text>R$ {item.preco}</Text>

              <Button
                mode='contained'
                buttonColor='#E53935'
                textColor='#FFF'
                onPress={() => excluirItem(item.id)}
                style={styles.botoes}
              >
                Excluir
              </Button>
            </View>
          )}
        />
      )}
    </View>
  );
}

// ---------- TELA DE VENDAS (VAZIA POR ENQUANTO) ----------
function VendasScreen() {
  const { itens, atualizarStatus, atualizarQuantidade } = useContext(ItemContext);

  if (itens.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Vendas</Text>
        <Text style={{ marginTop: 20, fontSize: 18 }}>Nenhum produto cadastrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Status dos produtos</Text>

      <FlatList
        data={itens}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{marginTop: 20}}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: '#FFF3F8',
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
              width: 280,
              alignItems: 'center',
            }}
          >
            <Image
              source={{ uri: item.imagem }}
              style={{ width: 80, height: 80, borderRadius: 10 }}
            />
            <Text style={{ fontWeight: 'bold', fontSize: 18}}>{item.nome}</Text>
            <Text>Preço: R$ {item.preco}</Text>
            <Text>Quantidade vendida: {item.quantidade}</Text>
            <Text>Status: {item.status}</Text>

            <View style={{ flexDirection: 'row', marginTop: 8}}>
              <Button
                mode='contained'
                onPress={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                style={{ marginHorizontal: 5 }}
              >
               + Venda
              </Button>
              <Button
                mode='outlined'
                onPress={() => atualizarStatus(item.id, item.status === 'Disponível' ? 'Esgotado' : 'Disponível')}>
                {item.status === 'Disponível' ? 'Esgotado' : 'Disponibilizar'}
              </Button>
            </View>
          </View>
        )}
      />
    </View>
  );
}


// ---------- DRAWER ----------
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
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
          <DrawerItemList {...props} />
          <View style={{ flex: 1 }} />
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
      <Drawer.Screen name="Tela Admin" component={AdminScreen} />
      <Drawer.Screen name="Relatórios" component={RelatorioScreen} />
      <Drawer.Screen name="Vendas" component={VendasScreen} />
    </Drawer.Navigator>
  );
}
