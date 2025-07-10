import { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import GarmentList from './garmentList';
import OrderHeader from './orderHeader';
import OrderSummary from './orderSummary';

const API_URL = "https://fzr3fd6k-5000.usw3.devtunnels.ms";

const garmentsList = [
    "Camisa", "Pantalon", "Prenda Interior", "Blusa", "Vestido",
    "Chamarra", "Traje", "Sueter", "Falda", "Saco", "Playera"
];

const servicesList = [
    { name: "Lavado", unitPrice: 22 },
    { name: "Planchado", unitPrice: 60 },
    { name: "Tintoreria", unitPrice: 0 },
    { name: "Especial", unitPrice: 0 }
];

const OrderForm = () => {
    const [order, setOrder] = useState({
        client_id: '',
        user_id: '',
        client: '',
        estimated_delivery_date: '', 
        garments: [{
            type: '',
            description: '',
            observations: '',
            services: [{
                name: '',
                service_description: '', 
                unitPrice: '',
                quantity: 1
            }]
        }]
    });

    const [showSummary, setShowSummary] = useState(false);

    const addGarment = () => {
        setOrder({
            ...order,
            garments: [...order.garments, {
                type: '',
                description: '',
                observations: '',
                services: [{
                    name: '',
                    service_description: '',
                    unitPrice: '',
                    quantity: 1
                }]
            }]
        });
    };

    const handleSubmit = async () => {
        
        if (!order.client_id || !order.user_id || !order.estimated_delivery_date) {
            Alert.alert('Error', 'Complete los campos obligatorios');
            return;
        }

        
        const apiData = {
            client_id: Number(order.client_id),
            user_id: Number(order.user_id),
            estimated_delivery_date: order.estimated_delivery_date,
            garments: order.garments.map(garment => ({
                type: garment.type,
                description: garment.description || '',
                observations: garment.observations || '',
                services: garment.services.map(service => ({
                    name: service.name,
                    service_description: service.service_description || '',
                    unitPrice: Number(service.unitPrice) || 0, 
                    quantity: Number(service.quantity) || 1
                })).filter(service => service.name) 
            })).filter(garment => garment.type) 
        };

        
        apiData.total = apiData.garments.reduce((total, garment) => {
            return total + garment.services.reduce((sum, service) => {
                return sum + (service.unitPrice * service.quantity);
            }, 0);
        }, 0);

        console.log("Datos a enviar:", JSON.stringify(apiData, null, 2));
        setShowSummary(true);
        
        
        setOrder(prev => ({ ...prev, apiData }));
    };

    const confirmOrder = async () => {
        try {
            
            const response = await fetch(`${API_URL}/orders/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order.apiData) 
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear pedido');
            }

            const data = await response.json();
            Alert.alert('Éxito', `Pedido ${data.order_id} creado (${data.status})`);
            setShowSummary(false);
            
        } catch (error) {
            console.error('Error al crear pedido:', error);
            Alert.alert('Error', error.message || 'No se pudo crear el pedido');
        }
    };

    return (
        <ScrollView>
            {showSummary ? (
                <OrderSummary
                    order={order.apiData}
                    onConfirm={confirmOrder}
                    onCancel={() => setShowSummary(false)}
                />
            ) : (
                <>
                    <OrderHeader
                        order={order}
                        setOrder={setOrder}
                    />

                    <GarmentList
                        order={order}
                        setOrder={setOrder}
                        garmentsList={garmentsList}
                        servicesList={servicesList}
                        onAddGarment={addGarment}
                        onSubmit={handleSubmit}
                    />
                </>
            )}
        </ScrollView>
    );
};

export default OrderForm;