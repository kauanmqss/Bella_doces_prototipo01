import { Text, View, Image, ActivityIndicator } from 'react-native';
import { useState } from 'react'
import { Button, TextInput } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminScreen from './admin';
import LojaScreen from './lojaScreen';
import LoadingScreen from './loadingScreen';
import { ItemProvider } from './ItemContext';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import styles from './styles';

const URL_FIREBASE = 'https://firestore.googleapis.com/v1/projects/cadastrologin-dd7bb/databases/(default)/documents/usuarios';

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

function CadastroScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarSenha = (senha) => /^(?=.*\d).{8,}$/.test(senha);

  const cadastrarUsuario = async () => {
    setErrorMessage('');

    if (!usuario.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      setErrorMessage('Por favor, preencha todos os campos corretamente!');
      return;
    }

    if (!validarEmail(email)) {
      setErrorMessage('Por favor, insira um Email válido!');
      return;
    }

    if (!validarSenha(senha)) {
      setErrorMessage('A senha deve ter pelo menos 8 caracteres e 1 número!');
      return;
    }

    if (senha !== confirmarSenha) {
      setErrorMessage('As senhas não coindicem!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(URL_FIREBASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            usuario: { stringValue: usuario },
            email: { stringValue: email },
            senha: { stringValue: senha },
          },
        }),
      });

      const data = await response.text();
      console.log('RESPOSTA FIREBASE:', data);

      setLoading(false);

      if (response.ok) {
        navigation.navigate('Login');
      } else {
        setErrorMessage('Erro ao cadastrar usuário no banco!');
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage('Erro de conexão com o servidor!');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color='#d6337f' />
        <Text style={styles.tituloLoading}>Cadastrando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={{
          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnS7U3ii7LT7w4blSet4qFVGloanl2ssUYlw&s'
        }}
      />
      <Text style={styles.titulo}>Cadastrar</Text>

      <TextInput
        placeholder='Usuário'
        style={styles.inputs}
        theme={inputTheme}
        mode='outlined'
        outlineColor='transparent'
        value={usuario}
        onChangeText={setUsuario}
      />

      <TextInput
        placeholder='Email'
        style={styles.inputs}
        theme={inputTheme}
        mode='outlined'
        outlineColor='transparent'
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder='Senha'
        style={styles.inputs}
        theme={inputTheme}
        mode='outlined'
        outlineColor='transparent'
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TextInput
        placeholder='Confirmar senha'
        style={styles.inputs}
        theme={inputTheme}
        mode='outlined'
        outlineColor='transparent'
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      {errorMessage ? <Text style={styles.erroText}>{errorMessage}</Text> : null}

      <View style={styles.botoesContainer}>
        <Button
          style={styles.botoes}
          mode='contained'
          onPress={cadastrarUsuario}
          labelStyle={{ fontFamily: 'Montserrat-Regular' }}
          color="#d6337f"
        >
          Criar conta
        </Button>

        <Button
          style={styles.botoes}
          mode='contained'
          onPress={() => navigation.navigate('Login')}
          labelStyle={{ fontFamily: 'Montserrat-Bold' }}
          color="#d6337f"
        >
          Voltar p/ Login
        </Button>
      </View>
    </View>
  );
}

function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const loginAdmin = async () => {
    setErrorMessage('');

    if (!usuario.trim() || !senha.trim()) {
      setErrorMessage('Por favor, preencha todos os campos corretamente!');
      return;
    }

    if (usuario === 'admin' && senha === 'admin123') {
      navigation.navigate('Admin');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(URL_FIREBASE);
      const text = await response.text();
      console.log('RESPOSTA FIREBASE', text);

      const data = JSON.parse(text);

      if (!data.documents) {
        setLoading(false);
        setErrorMessage('Nenhum dado encontrado no banco!');
        return;
      }

      const usuarios = data.documents.map((doc) => {
        const fields = doc.fields || {};
        return {
          usuario: fields.usuario?.stringValue || '',
          senha: fields.senha?.stringValue || '',
          email: fields.email?.stringValue || '',
        };
      });

      const usuarioValido = usuarios.find(
        (u) => u.usuario === usuario && u.senha === senha
      );

      setLoading(false);

      if (usuarioValido) {
        navigation.navigate('Loja');
      } else {
        setErrorMessage('Usuário ou senha incorretos!');
      }

    } catch (error) {
      setLoading(false);
      setErrorMessage('Erro ao conectar com o servidor!');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color='#d6337f' />
        <Text style={styles.tituloLoading}>Entrando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={{
          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnS7U3ii7LT7w4blSet4qFVGloanl2ssUYlw&s'
        }}
      />
      <Text style={styles.titulo}>Login</Text>

      <TextInput
        placeholder='Usuário'
        style={styles.inputs}
        theme={inputTheme}
        mode='outlined'
        outlineColor='transparent'
        value={usuario}
        onChangeText={setUsuario}
      />

      <TextInput
        placeholder='Senha'
        style={styles.inputs}
        theme={inputTheme}
        mode='outlined'
        outlineColor='transparent'
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {errorMessage ? <Text style={styles.erroText}>{errorMessage}</Text> : null}

      <Button
        style={styles.botoes}
        labelStyle={{ fontFamily: 'Montserrat-Regular' }}
        color="#d6337f"
        mode='contained'
        onPress={loginAdmin}
      >
        Entrar
      </Button>

      <Text style={styles.frase}>Não possui uma conta? Cadastre-se!</Text>

      <Button
        style={styles.botoes}
        labelStyle={{ fontFamily: 'Montserrat-Bold' }}
        color="#d6337f"
        mode="contained"
        onPress={() => navigation.navigate('Cadastro')}
      >
        Cadastre-se
      </Button>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'PoppinsLight': require('./assets/fonts/Poppins-Light.ttf'),
    'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Light': require('./assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
  });

  if (!fontsLoaded) return <AppLoading />;

  return (
    <ItemProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Login'>
          <Stack.Screen name='Loading' component={LoadingScreen} />
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='Cadastro' component={CadastroScreen} />
          <Stack.Screen name='Admin' component={AdminScreen} />
          <Stack.Screen name='Loja' component={LojaScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ItemProvider>
  );
}
