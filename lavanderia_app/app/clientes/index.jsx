import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
const EXPO_PUBLIC_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export default function ClientsScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [clientes, setClientes] = useState([]);

  const searchClient = async (type, value) => {
    try {
      if (!value) {
        Alert.alert("Error", "Completa los datos");
        return;
      }

      const response = await fetch(`${EXPO_PUBLIC_BASE_URL}/clients/search?${type}=${encodeURIComponent(value)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Error al buscar cliente");
      }

      const data = await response.json();
      const resultData = type === "phone" ? [data] : data;

      Alert.alert("Éxito", "Usuario encontrado con éxito");
      setClientes(resultData);

    } catch (error) {
      Alert.alert("Error", error.message || "Error en el servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Módulo de Clientes</Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar por nombre"
        value={name}
        onChangeText={setName}
      />
      <Pressable
        style={styles.button}
        onPress={() => searchClient("name", name)}
      >
        <Text style={styles.textButton}>Buscar por Nombre</Text>
      </Pressable>

      <TextInput
        style={styles.input}
        placeholder="Buscar por teléfono"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <Pressable
        style={styles.button}
        onPress={() => searchClient("phone", phone)}
      >
        <Text style={styles.textButton}>Buscar por Teléfono</Text>
      </Pressable>

      <Pressable style={styles.button}>
        <Link href="/clientes/createC" style={styles.textButton}>Crear Cliente</Link>
      </Pressable>

      <Pressable style={styles.button}>
        <Link href="/ordenes" style={styles.textButton}>Ordenes</Link>
      </Pressable>

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
              <Pressable style={[styles.actionButton, styles.updateButton]}>
                <Link href={`/clientes/updateC?id=${item.id}`} style={styles.textButton}>Editar</Link>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.deleteButton]}>
                <Link href={`/clientes/deleteC?id=${item.id}`} style={styles.textButton}>Eliminar</Link>
              </Pressable>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 14,
    marginVertical: 8,
    alignItems: "center",
  },
  textButton: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: '#f8f9fa',
    padding: 16,
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
    marginBottom: 4,
  },
  listContainer: {
    paddingBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionButton: {
    borderRadius: 8,
    padding: 10,
    width: '48%',
    alignItems: "center",
  },
  updateButton: {
    backgroundColor: "#34C759",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
});