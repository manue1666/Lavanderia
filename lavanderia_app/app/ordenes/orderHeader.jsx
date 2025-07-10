import { StyleSheet, Text, TextInput, View } from 'react-native';

const OrderHeader = ({ order, setOrder }) => {
  const handleNumberChange = (field, value) => {
    const numValue = value === '' ? '' : parseInt(value) || 0;
    setOrder({...order, [field]: numValue});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos del Pedido</Text>
      
      
      <Text style={styles.label}>ID Cliente *</Text>
      <TextInput
        style={styles.input}
        value={order.client_id.toString()}
        onChangeText={(text) => handleNumberChange('client_id', text)}
        keyboardType="numeric"
        placeholder="Ej: 2"
      />
      
      <Text style={styles.label}>ID Usuario *</Text>
      <TextInput
        style={styles.input}
        value={order.user_id.toString()}
        onChangeText={(text) => handleNumberChange('user_id', text)}
        keyboardType="numeric"
        placeholder="Ej: 1"
      />

      <Text style={styles.label}>Fecha Entrega *</Text>
      <TextInput
        style={styles.input}
        value={order.estimated_delivery_date}
        onChangeText={(text) => setOrder({...order, estimated_delivery_date: text})}
        placeholder="YYYY-MM-DD"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  }
});

export default OrderHeader;