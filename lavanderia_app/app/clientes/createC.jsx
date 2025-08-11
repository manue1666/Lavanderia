import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
const EXPO_PUBLIC_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL


export default function CreateClientScreen() {
  const router = useRouter();
  const [client, setClient] = useState({
    name: "",
    phone_number: "",
    address: ""
  });

  const handleCreateClient = async () => {
    try {
      // Validacion de campos
      if (!client.name || !client.phone_number || !client.address) {
        Alert.alert("Error", "Por favor completa todos los campos");
        return;
      }

      const response = await fetch(`${EXPO_PUBLIC_BASE_URL}/clients/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear cliente");
      }

      const data = await response.json();
      Alert.alert("Éxito", "Cliente creado correctamente");
      console.log(data)
      router.push("/clientes");

    } catch (error) {
      console.error("Error al crear cliente:", error);
      Alert.alert("Error", error.message || "Ocurrió un error al crear el cliente");
    }
  };

  const handleChange = (field, value) => {
    setClient(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cliente</Text>
      
      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa el nombre"
        value={client.name}
        onChangeText={(text) => handleChange('name', text)}
        autoCapitalize="words"
      />
      
      <Text style={styles.label}>Teléfono:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa el teléfono"
        value={client.phone_number}
        onChangeText={(text) => handleChange('phone_number', text)}
        keyboardType="phone-pad"
      />
      
      <Text style={styles.label}>Dirección:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa la dirección"
        value={client.address}
        onChangeText={(text) => handleChange('address', text)}
      />
      
      <Pressable style={styles.button} onPress={handleCreateClient}>
        <Text style={styles.buttonText}>Crear Cliente</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});