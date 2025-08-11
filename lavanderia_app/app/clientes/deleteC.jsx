import { useRouter, useSearchParams } from 'expo-router/build/hooks';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
const EXPO_PUBLIC_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export default function DeleteClientScreen() {
    const router = useRouter();
    const params = useSearchParams();
    const id = params.get("id");
    console.log("ID recibido:", id);

    const deleteClient = async () => {
        if (!id) {
            Alert.alert("Error", "ID de cliente no encontrado");
            return;
        }

        try {
            const response = await fetch(`${EXPO_PUBLIC_BASE_URL}/clients/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "No se pudo eliminar el cliente");
            }

            const data = await response.json();
            Alert.alert("Éxito", "Cliente eliminado correctamente");
            console.log("Respuesta:", data);
            router.push("/clientes");
            
        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Error", error.message || "Error en el servidor");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Eliminar Cliente</Text>
                <Text style={styles.idText}>¿Estás seguro de eliminar al cliente con ID: {id}?</Text>
                
                <View style={styles.buttonContainer}>
                    <Pressable 
                        style={({ pressed }) => [
                            styles.cancelButton,
                            pressed && styles.buttonPressed
                        ]} 
                        onPress={() => router.push("/clientes")}
                    >
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </Pressable>
                    
                    <Pressable 
                        style={({ pressed }) => [
                            styles.deleteButton,
                            pressed && styles.buttonPressed
                        ]} 
                        onPress={deleteClient}
                    >
                        <Text style={styles.buttonText}>Confirmar Eliminación</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#d32f2f',
        marginBottom: 16,
        textAlign: 'center',
    },
    idText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    cancelButton: {
        backgroundColor: '#757575',
        borderRadius: 8,
        padding: 14,
        flex: 1,
        marginRight: 8,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#d32f2f',
        borderRadius: 8,
        padding: 14,
        flex: 1,
        marginLeft: 8,
        alignItems: 'center',
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});