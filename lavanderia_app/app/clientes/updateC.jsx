
import { useSearchParams } from 'expo-router/build/hooks';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function UpdateClientScreen() {
  const params = useSearchParams()
  const id = params.get("id")
  console.log("ID recibido:", id)

  const [name, setName] = useState('')
  const [phone_number, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')

  const updateClient = async () => {

    if (!id) {
      Alert.alert("Error", "ID no encontrado")
      return;
    }

    if (!name || !phone_number || !address) {
      Alert.alert("Error", "Por favor completa todos los campos")
      return;
    }

    try {
      const response = await fetch(`https://5q79hxmw-5000.usw3.devtunnels.ms/clients/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone_number, address }),
      })

      const data = await response.json()

      if (response.ok) {
        Alert.alert("Éxito", "Cliente actualizado correctamente")
        console.log(data);
      } else {
        Alert.alert("Error", "No se pudo actualizar el cliente")
      }
    } catch (error) {
      Alert.alert("Error en el servidor")
      console.log("error:", error)
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Actualizar Cliente</Text>
        <Text style={styles.label}>ID: {id}</Text>
        <Text style={styles.label}>Nombre:</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
        <Text style={styles.label}>Teléfono:</Text>
        <TextInput style={styles.input} value={phone_number} onChangeText={setPhoneNumber} />
        <Text style={styles.label}>Dirección:</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} />
        <Pressable style={styles.send} onPress={updateClient}>
          <Text style={styles.textButton}>Actualizar</Text>
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