import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';



export default function ClientsScreen() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [clientes, setClientes] = useState([])

  const searchName = async () => {
    try {
      if (!name) {
        Alert.alert("error", "completa los datos")
        return
      }

      const response = await fetch(`https://5q79hxmw-5000.usw3.devtunnels.ms/clients/search/name?name=${encodeURIComponent(name)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json()

      if (response.ok) {
        Alert.alert("Usuario encontrado con exito")
        console.log(data)
        setClientes(data)

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
        <Text style={styles.title}>Módulo de Clientes</Text>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nombre"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Pressable style={styles.send} onPress={searchName}>
          <Text style={styles.textButton}>Buscar</Text>
        </Pressable>
        <Pressable style={styles.send}>
          <Link href="/clientes/createC" style={styles.textButton}>Crear Cliente</Link>
        </Pressable>

        <View style={styles.listContainer}>
          <FlatList
            data={clientes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.nombre}>{item.name}</Text>
                <Text>ID: {item.id}</Text>
                <Text>Teléfono: {item.phone_number}</Text>
                <Text>Dirección: {item.address}</Text>
                <View style={styles.buttonContainer}>
                  <Pressable style={styles.updaT}>
                    <Link href={`/clientes/updateC?id=${item.id}`} style={styles.textButton}>Update</Link>
                  </Pressable>
                  <Pressable style={styles.deleT}>
                    <Text style={styles.textButton}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
        </View>
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
  card: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 30,
    marginTop: 20,
    fontWeight: "bold",
    margin: 15
  },
  label: {
    marginTop: 20,
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
  updaT: {
    backgroundColor: "cyan",
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
    paddingVertical: 10,
    width: 100
  },
  deleT: {
    backgroundColor: "red",
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
    paddingVertical: 10,
    width: 100
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
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

