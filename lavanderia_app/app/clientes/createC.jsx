import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

//name
//phone_number
//address

// client
// : 
// address
// : 
// "mi casa"
// created_at
// : 
// "Thu, 05 Jun 2025 20:43:18 GMT"
// id
// : 
// 145
// name
// : 
// "nuncio cliente"
// phone_number
// : 
// "4491111111"
// [[Prototype]]
// : 
// Object
// msg
// : 
// "cliente creado con exito"

export default function CreateClientScreen() {

  const router = useRouter()
  const [name, setName] = useState("");
  const [phone_number, setPhoneN] = useState("");
  const [address, setAddress] = useState("");

  const crearCliente = async () => {
    try {
      if (!name || !phone_number || !address) {
        Alert.alert("completa los datos")
        return
      }

      const response = await fetch(`https://5q79hxmw-5000.usw3.devtunnels.ms/clients/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone_number, address }),
      });

      const data = response.json()


      if (response.ok) {
        Alert.alert("Cliente creado con exito")
        console.log(data)
        router.push("/clientes")

      } else {
        Alert.alert("error al crear usuario")
      }

    } catch (error) {
      Alert.alert("ocurrio un error:")
      console.log("ocurrio un error", error)
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Crear Cliente</Text>
        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={styles.input}
          placeholder='ingresa tu nombre'
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Text style={styles.label}>Telefono:</Text>
        <TextInput
          style={styles.input}
          placeholder='ingresa tu telefono'
          value={phone_number}
          onChangeText={(text) => setPhoneN(text)}
        />
        <Text style={styles.label}>Direccion:</Text>
        <TextInput
          style={styles.input}
          placeholder='ingresa tu direccion'
          value={address}
          onChangeText={(text) => setAddress(text)}
        />
        <Pressable style={styles.send} onPress={crearCliente}>
          <Text style={styles.textButton}>Crear</Text>
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
