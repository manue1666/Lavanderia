import { useRouter, useSearchParams } from 'expo-router/build/hooks';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
const EXPO_PUBLIC_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL


export default function UpdateClientScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  console.log("ID recibido:", id);

  const [form, setForm] = useState({
    name: '',
    phone_number: '',
    address: ''
  });

  const updateClient = async () => {
    if (!id) {
      Alert.alert("Error", "ID no encontrado");
      return;
    }

    if (!form.name || !form.phone_number || !form.address) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    try {
      const response = await fetch(`${EXPO_PUBLIC_BASE_URL}/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", "Cliente actualizado correctamente");
        console.log(data);
        router.push("/clientes");
      } else {
        Alert.alert("Error", data.message || "No se pudo actualizar el cliente");
      }
    } catch (error) {
      console.log("error:", error);
      Alert.alert("Error", "Error en el servidor");
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Actualizar Cliente</Text>
        <Text style={styles.idText}>ID: {id}</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre:</Text>
          <TextInput 
            style={styles.input} 
            value={form.name} 
            onChangeText={(text) => handleChange('name', text)}
            placeholder="Nombre del cliente"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono:</Text>
          <TextInput 
            style={styles.input} 
            value={form.phone_number} 
            onChangeText={(text) => handleChange('phone_number', text)}
            keyboardType="phone-pad"
            placeholder="Número de teléfono"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dirección:</Text>
          <TextInput 
            style={styles.input} 
            value={form.address} 
            onChangeText={(text) => handleChange('address', text)}
            placeholder="Dirección completa"
          />
        </View>
        
        <Pressable 
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.submitButtonPressed
          ]} 
          onPress={updateClient}
        >
          <Text style={styles.submitButtonText}>Actualizar Cliente</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  idText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  submitButton: {
    backgroundColor: '#4a80f0',
    borderRadius: 8,
    padding: 14,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonPressed: {
    backgroundColor: '#3a70e0',
    opacity: 0.9,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});