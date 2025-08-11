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

export default function ServicesScreen() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState(null);

    // Fetch all services
    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${EXPO_PUBLIC_BASE_URL}/services/`);
            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error("Error fetching services:", error);
            Alert.alert("Error", "No se pudieron cargar los servicios");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Create or update service
    const handleSubmit = async () => {
        if (!name || !price) {
            Alert.alert("Error", "Nombre y precio son requeridos");
            return;
        }

        const serviceData = {
            name,
            price: parseFloat(price),
            description: description || null
        };

        try {
            if (editingId) {
                // Update existing service
                const response = await fetch(`${EXPO_PUBLIC_BASE_URL}/services/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(serviceData)
                });

                if (!response.ok) throw new Error("Error al actualizar");

                Alert.alert("Éxito", "Servicio actualizado correctamente");
            } else {
                // Create new service
                const response = await fetch(`${EXPO_PUBLIC_BASE_URL}/services/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(serviceData)
                });

                if (!response.ok) throw new Error("Error al crear");

                Alert.alert("Éxito", "Servicio creado correctamente");
            }

            resetForm();
            fetchServices();
        } catch (error) {
            console.error("Error saving service:", error);
            Alert.alert("Error", error.message || "Error al guardar el servicio");
        }
    };

    // Delete service
    const handleDelete = async (serviceId) => {
        console.log("Iniciando eliminación para servicio:", serviceId); // Paso 1

        try {
            console.log("URL de la solicitud:", `${EXPO_PUBLIC_BASE_URL}/services/${serviceId}`); // Paso 2

            const response = await fetch(
                `${EXPO_PUBLIC_BASE_URL}/services/${serviceId}`,
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
            Alert.alert("Éxito", "Servicio eliminado correctamente");

            // Actualización optimista
            setServices(prev => prev.filter(service => service.id !== serviceId));
            setFilteredServices(prev => prev.filter(service => service.id !== serviceId));

        } catch (error) {
            console.error("Error completo:", error); // Paso 5
            Alert.alert("Error", error.message || "No se pudo eliminar el servicio");
        }
    };

    // Edit service
    const handleEdit = (service) => {
        setEditingId(service.id);
        setName(service.name);
        setPrice(service.price.toString());
        setDescription(service.description || '');
    };

    // Reset form
    const resetForm = () => {
        setEditingId(null);
        setName('');
        setPrice('');
        setDescription('');
    };

    // Refresh list
    const handleRefresh = () => {
        setRefreshing(true);
        fetchServices();
    };

    useEffect(() => {
        fetchServices();
    }, []);

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            }
        >
            {/* Formulario de creación/edición */}
            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>
                    {editingId ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nombre del servicio*"
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Precio*"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Descripción"
                    value={description}
                    onChangeText={setDescription}
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

            {/* Listado de servicios */}
            <Text style={styles.listTitle}>Listado de Servicios</Text>

            {services.length === 0 ? (
                <Text style={styles.emptyText}>No hay servicios registrados</Text>
            ) : (
                <FlatList
                    data={services}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <View style={styles.serviceCard}>
                            <View style={styles.serviceHeader}>
                                <Text style={styles.serviceName}>{item.name}</Text>
                                <Text style={styles.servicePrice}>${item.price.toFixed(2)}</Text>
                            </View>

                            {item.description && (
                                <Text style={styles.serviceText}>Descripción: {item.description}</Text>
                            )}

                            <View style={styles.actions}>
                                <Pressable
                                    style={styles.actionButton}
                                    onPress={() => handleEdit(item)}
                                >
                                    <MaterialIcons name="edit" size={20} color="#FF9800" />
                                    <Text style={styles.actionText}>Editar</Text>
                                </Pressable>

                                <Pressable
                                    style={styles.actionButton}
                                    onPress={() => handleDelete(item.id)}
                                >
                                    <MaterialIcons name="delete" size={20} color="#F44336" />
                                    <Text style={styles.actionText}>Eliminar</Text>
                                </Pressable>
                            </View>
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
    serviceCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
    },
    serviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    servicePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    serviceText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        marginLeft: 4,
        color: '#555',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
});