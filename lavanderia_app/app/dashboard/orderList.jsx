import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const EXPO_PUBLIC_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function OrderListScreen() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);

    const statusColors = {
        'recibido': '#FFA500',    // naranja
        'en proceso': '#2196F3',  // azul
        'terminado': '#4CAF50',   // verde
        'entregado': '#9C27B0'    // morado
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${EXPO_PUBLIC_BASE_URL}/orders/dashboard?page=1`);
            const data = await response.json();

            // Asumimos que la respuesta es un array directo de órdenes
            if (Array.isArray(data)) {
                setOrders(data);
                setFilteredOrders(data);
            } else {
                throw new Error("Formato de datos inesperado");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            Alert.alert("Error", "No se pudieron cargar las órdenes");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
        if (text) {
            const filtered = orders.filter(order =>
                order.id.toString().includes(text) ||
                order.client_id.toString().includes(text)
            );
            setFilteredOrders(filtered);
        } else {
            setFilteredOrders(orders);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const handleDelete = async (orderId) => {
        console.log("Iniciando eliminación para orden:", orderId); // Paso 1

        try {
            console.log("URL de la solicitud:", `${EXPO_PUBLIC_BASE_URL}/orders/${orderId}`); // Paso 2

            const response = await fetch(
                `${EXPO_PUBLIC_BASE_URL}/orders/${orderId}`,
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
            Alert.alert("Éxito", "Orden eliminada correctamente");

            // Actualización optimista
            setOrders(prev => prev.filter(order => order.id !== orderId));
            setFilteredOrders(prev => prev.filter(order => order.id !== orderId));

        } catch (error) {
            console.error("Error completo:", error); // Paso 5
            Alert.alert("Error", error.message || "No se pudo eliminar la orden");
        }
    };

    const changeStatus = async (orderId, currentStatus) => {
        try {
            const statusOrder = ['recibido', 'en proceso', 'terminado', 'entregado'];
            const currentIndex = statusOrder.indexOf(currentStatus);
            const nextStatus = statusOrder[currentIndex + 1] || statusOrder[0];

            const response = await fetch(
                `${EXPO_PUBLIC_BASE_URL}/orders/${orderId}/status`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: nextStatus })
                }
            );

            if (response.ok) {
                fetchOrders();
            } else {
                throw new Error("Error al cambiar estado");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            Alert.alert("Error", "No se pudo cambiar el estado de la orden");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Listado de Órdenes</Text>
                <Pressable
                    style={styles.addButton}
                    onPress={() => router.push('/ordenes/')}
                >
                    <MaterialIcons name="add" size={24} color="white" />
                </Pressable>
            </View>

            <TextInput
                style={styles.searchInput}
                placeholder="Buscar por ID de orden o cliente..."
                value={searchQuery}
                onChangeText={handleSearch}
            />

            {filteredOrders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No se encontraron órdenes</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredOrders}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                        />
                    }
                    renderItem={({ item }) => (
                        <View style={styles.orderCard}>
                            <View style={styles.orderHeader}>
                                <Text style={styles.orderId}>Orden #{item.id}</Text>
                                <Pressable
                                    style={[styles.statusBadge, { backgroundColor: statusColors[item.state] }]}
                                    onPress={() => changeStatus(item.id, item.state)}
                                >
                                    <Text style={styles.statusText}>{item.state.toUpperCase()}</Text>
                                </Pressable>
                            </View>

                            <Text style={styles.clientText}>ID Cliente: {item.client_id}</Text>

                            <Text style={styles.dateText}>
                                Fecha estimada: {new Date(item.estimated_delivery_date).toLocaleDateString()}
                            </Text>

                            <Text style={styles.totalText}>Total: ${item.total.toFixed(2)}</Text>

                            <View style={styles.actionsContainer}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => {
                                        console.log("ID de orden a eliminar:", item.id); // Verificamos el ID
                                        handleDelete(item.id);
                                    }}
                                    activeOpacity={0.6}
                                    testID="delete-button" // Para pruebas
                                >
                                    <MaterialIcons name="delete" size={20} color="#F44336" />
                                    <Text style={styles.actionText}>Eliminar</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    )}
                />
            )}
        </View>
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        backgroundColor: '#9C27B0',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchInput: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    orderCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    orderId: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    clientText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
    },
    dateText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    actionText: {
        marginLeft: 4,
        color: '#555',
    },
});