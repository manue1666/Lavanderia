import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';


//backend: https://5q79hxmw-5000.usw3.devtunnels.ms/




export default function CreateUserScreen() {

  const router = useRouter()

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const regist = async () => {
    try {
      if (!email || !name || !password) {
        Alert.alert("error", "completa los datos")
        return
      }

      const response = await fetch(`https://5q79hxmw-5000.usw3.devtunnels.ms/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json()

      if (response.ok) {
        Alert.alert("Usuario registrado con exito")
        console.log(data)
        router.push("/login")
      } else {
        Alert.alert("Error al enviar los datos")
      }

    } catch (error) {
      Alert.alert("error en el servidor")
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Registrarse</Text>
        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={styles.input}
          placeholder='ingresa tu nombre'
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder='ingresa tu correo'
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          placeholder='ingresa tu contraseña'
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Pressable style={styles.send} onPress={regist}>
          <Text style={styles.textButton}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 30,
    marginTop: 30,
    fontWeight: "bold",
    margin: 15,
    marginLeft: 1
  },
  label: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "gray",
    fontSize: 20,
    paddingHorizontal: 10,
    marginVertical: 15,
    backgroundColor: "white",
  },
  send: {
    backgroundColor: "blue",
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
    paddingVertical: 10,
    width: 300
  },
  recover: {
    backgroundColor: "darkred",
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
    paddingVertical: 10,
    padding: 15
  },
  textButton: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  containerFooter: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 20,
    margin: 5,
  },
});

