import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const EXPO_PUBLIC_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function DashboardScreen() {
    const router = useRouter();
    const [counts, setCounts] = useState(null);
    const [loading, setLoading] = useState(true);

    // Rutas manuales fijas
    const dashboardItems = [
        {
            title: 'Clientes',
            color: '#4CAF50',
            icon: '👥',
            route: '/clientes',
            countKey: 'clients'
        },
        {
            title: 'Prendas',
            color: '#2196F3',
            icon: '👕',
            route: '/dashboard/prendasList',
            countKey: 'garments'
        },
        {
            title: 'Servicios',
            color: '#FF9800',
            icon: '🧼',
            route: '/dashboard/serviciosList',
            countKey: 'services'
        },
        {
            title: 'Órdenes',
            color: '#9C27B0',
            icon: '📝',
            route: '/dashboard/orderList',
            countKey: 'orders'
        }
    ];

    const fetchCounts = async () => {
        try {
            const response = await fetch(`${EXPO_PUBLIC_BASE_URL}/orders/counts`);
            const data = await response.json();
            setCounts(data);
        } catch (error) {
            console.error("Error fetching counts:", error);
            // Si hay error, establecer valores por defecto
            setCounts({
                clients: 0,
                garments: 0,
                services: 0,
                orders: 0
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCounts();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>Dashboard Administrativo</Text>

                <View style={styles.gridContainer}>
                    {dashboardItems.map((item, index) => (
                        <Pressable
                            key={index}
                            style={[styles.card, { backgroundColor: item.color }]}
                            onPress={() => router.push(item.route)}
                        >
                            <Text style={styles.cardIcon}>{item.icon}</Text>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardCount}>
                                {counts ? counts[item.countKey] || 0 : 0}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: '#333',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        aspectRatio: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    cardIcon: {
        fontSize: 40,
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    cardCount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});