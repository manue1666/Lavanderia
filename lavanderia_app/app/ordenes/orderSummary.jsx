import { Pressable, StyleSheet, Text, View } from 'react-native';

const OrderSummary = ({ order, onConfirm, onCancel }) => {
  
  const calculateTotal = () => {
    return order.garments?.reduce((total, garment) => {
      return total + (garment.services?.reduce((sum, service) => {
        return sum + ((service.unitPrice || 0) * (service.quantity || 1));
      }, 0) || 0);
    }, 0) || 0;
  };

  const total = order.total !== undefined ? order.total : calculateTotal();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen del Pedido</Text>
      
      <View style={styles.summaryCard}>
        <Text style={styles.label}>ID Cliente: {order.client_id}</Text>
        <Text style={styles.label}>ID Usuario: {order.user_id}</Text>
        <Text style={styles.label}>Fecha Entrega: {order.estimated_delivery_date}</Text>
      </View>

      {order.garments?.map((garment, gIndex) => (
        <View key={gIndex} style={styles.garmentCard}>
          <Text style={styles.garmentTitle}>{garment.type}</Text>
          <Text style={styles.garmentDescription}>{garment.description}</Text>
          <Text style={styles.observations}>Observaciones: {garment.observations}</Text>
          
          <View style={styles.servicesContainer}>
            {garment.services?.map((service, sIndex) => (
              <View key={sIndex} style={styles.serviceItem}>
                <Text style={styles.serviceName}>
                  {service.name} (x{service.quantity || 1})
                </Text>
                <Text style={styles.servicePrice}>
                  ${(service.unitPrice || 0) * (service.quantity || 1)}
                </Text>
                {service.service_description ? (
                  <Text style={styles.serviceDesc}>{service.service_description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalAmount}>${total}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Pressable 
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.buttonText}>Modificar</Text>
        </Pressable>
        
        <Pressable 
          style={[styles.button, styles.confirmButton]}
          onPress={onConfirm}
        >
          <Text style={styles.buttonText}>Confirmar Pedido</Text>
        </Pressable>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  summaryCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    marginBottom: 4
  },
  garmentCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12
  },
  garmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  garmentDescription: {
    fontSize: 14,
    marginBottom: 4
  },
  observations: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 8
  },
  servicesContainer: {
    marginTop: 8
  },
  serviceItem: {
    borderLeftWidth: 3,
    borderLeftColor: '#2196f3',
    paddingLeft: 8,
    marginBottom: 8
  },
  serviceName: {
    fontWeight: '500'
  },
  servicePrice: {
    fontWeight: 'bold',
    color: '#2e7d32'
  },
  serviceDesc: {
    fontSize: 12,
    color: '#666'
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginTop: 8
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2e7d32'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4
  },
  cancelButton: {
    backgroundColor: '#e0e0e0'
  },
  confirmButton: {
    backgroundColor: '#2e7d32'
  },
  buttonText: {
    fontWeight: '500',
    color: 'white'
  }
});

export default OrderSummary;