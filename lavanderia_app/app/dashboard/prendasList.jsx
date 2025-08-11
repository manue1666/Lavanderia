import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

const EXPO_PUBLIC_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function GarmentScreen() {
    const [garments, setGarments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Form states
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [observations, setObservations] = useState('');
    const [editingId, setEditingId] = useState(null);

    // Fetch all garments
    const fetchGarments = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${EXPO_PUBLIC_BASE_URL}/garments/`);
            const data = await response.json();
            setGarments(data);
        } catch (error) {
            console.error("Error fetching garments:", error);
            Alert.alert("Error", "No se pudieron cargar las prendas");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Create or update garment
    const handleSubmit = async () => {
        if (!type) {
            Alert.alert("Error", "El tipo de prenda es requerido");
            return;
        }

        const garmentData = {
            type,
            description: description || null,
            observations: observations || null
        };

        try {
            if (editingId) {
                // Update existing garment
                const response = await fetch(`${EXPO_PUBLIC_BASE_URL}/garments/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(garmentData)
                });

                if (!response.ok) throw new Error("Error al actualizar");

                Alert.alert("Éxito", "Prenda actualizada correctamente");
            } else {
                // Create new garment
                const response = await fetch(`${EXPO_PUBLIC_BASE_URL}/garments/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(garmentData)
                });

                if (!response.ok) throw new Error("Error al crear");

                Alert.alert("Éxito", "Prenda creada correctamente");
            }

            resetForm();
            fetchGarments();
        } catch (error) {
            console.error("Error saving garment:", error);
            Alert.alert("Error", error.message || "Error al guardar la prenda");
        }
    };

    const handleDelete = async (garmentId) => {
        console.log("Iniciando eliminación para prenda:", garmentId); // Paso 1

        try {
            console.log("URL de la solicitud:", `${EXPO_PUBLIC_BASE_URL}/garments/${garmentId}`); // Paso 2

            const response = await fetch(
                `${EXPO_PUBLIC_BASE_URL}/garments/${garmentId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("Respuesta recibida. Status:", response.status); // Paso 3

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error("Error del servidor:", errorData);
                throw new Error(errorData?.message || "Error al eliminar");
            }

            console.log("Eliminación exitosa"); // Paso 4
            Alert.alert("Éxito", "prenda eliminada correctamente");

            // Actualización optimista
            setGarments(prev => prev.filter(garment => garment.id !== garmentId));
            setFilteredGarments(prev => prev.filter(garment => garment.id !== garmentId));

        } catch (error) {
            console.error("Error completo:", error); // Paso 5
            Alert.alert("Error", error.message || "No se pudo eliminar la prenda");
        }
    };

    // Edit garment
    const handleEdit = (garment) => {
        setEditingId(garment.id);
        setType(garment.type);
        setDescription(garment.description || '');
        setObservations(garment.observations || '');
    };

    // Reset form
    const resetForm = () => {
        setEditingId(null);
        setType('');
        setDescription('');
        setObservations('');
    };

    // Refresh list
    const handleRefresh = () => {
        setRefreshing(true);
        fetchGarments();
    };

    useEffect(() => {
        fetchGarments();
    }, []);

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Formulario de creación/edición */}
            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>
                    {editingId ? 'Editar Prenda' : 'Agregar Nueva Prenda'}
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Tipo de prenda*"
                    value={type}
                    onChangeText={setType}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Descripción"
                    value={description}
                    onChangeText={setDescription}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Observaciones"
                    value={observations}
                    onChangeText={setObservations}
                    multiline
                />

                <View style={styles.formButtons}>
                    {editingId && (
                        <Pressable
                            style={[styles.button, styles.cancelButton]}
                            onPress={resetForm}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </Pressable>
                    )}

                    <Pressable
                        style={[styles.button, styles.submitButton]}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.buttonText}>
                            {editingId ? 'Actualizar' : 'Guardar'}
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* Listado de prendas */}
            <Text style={styles.listTitle}>Listado de Prendas</Text>

            {garments.length === 0 ? (
                <Text style={styles.emptyText}>No hay prendas registradas</Text>
            ) : (
                <FlatList
                    data={garments}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false} // Usamos ScrollView padre
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                        />
                    }
                    renderItem={({ item }) => (
                        <View style={styles.garmentCard}>
                            <View style={styles.garmentHeader}>
                                <Text style={styles.garmentType}>{item.type}</Text>
                                <View style={styles.actions}>
                                    <Pressable onPress={() => handleEdit(item)}>
                                        <MaterialIcons name="edit" size={20} color="#FF9800" />
                                    </Pressable>
                                    <Pressable onPress={() => handleDelete(item.id)}>
                                        <MaterialIcons name="delete" size={20} color="#F44336" />
                                    </Pressable>
                                </View>
                            </View>

                            {item.description && (
                                <Text style={styles.garmentText}>Descripción: {item.description}</Text>
                            )}

                            {item.observations && (
                                <Text style={styles.garmentText}>Observaciones: {item.observations}</Text>
                            )}
                        </View>
                    )}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 12,
        color: '#333',
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 12,
        marginBottom: 12,
    },
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 4,
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: '#4CAF50',
    },
    cancelButton: {
        backgroundColor: '#9E9E9E',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    garmentCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
    },
    garmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    garmentType: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    actions: {
        flexDirection: 'row',
        gap: 15,
    },
    garmentText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
});