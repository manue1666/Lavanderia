import { Picker } from '@react-native-picker/picker';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const GarmentList = ({ order, setOrder, garmentsList, servicesList, onAddGarment, onSubmit }) => {
  const updateGarment = (index, field, value) => {
    const updated = [...order.garments];
    updated[index][field] = value;
    setOrder({ ...order, garments: updated });
  };

  const updateService = (garmentIndex, serviceIndex, field, value) => {
    const updatedGarments = [...order.garments];

    if (field === 'unitPrice' || field === 'quantity') {
      updatedGarments[garmentIndex].services[serviceIndex][field] =
        value === '' ? '' : Number(value) || 0;
    } else {
      updatedGarments[garmentIndex].services[serviceIndex][field] = value;
    }

    setOrder({ ...order, garments: updatedGarments });
  };
  const addService = (garmentIndex) => {
    const updated = [...order.garments];
    updated[garmentIndex].services.push({
      name: '',
      description: '',
      price: '',
      quantity: 1
    });
    setOrder({ ...order, garments: updated });
  };

  const removeGarment = (index) => {
    const updated = [...order.garments];
    updated.splice(index, 1);
    setOrder({ ...order, garments: updated });
  };

  const removeService = (garmentIndex, serviceIndex) => {
    const updated = [...order.garments];
    updated[garmentIndex].services.splice(serviceIndex, 1);
    setOrder({ ...order, garments: updated });
  };

  return (
    <View style={styles.container}>
      {order.garments.map((garment, gIndex) => (
        <View key={gIndex} style={styles.garmentCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo de Prenda:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={garment.type}
                onValueChange={(value) => updateGarment(gIndex, 'type', value)}
                style={styles.picker}
              >
                <Picker.Item label="Seleccione..." value="" />
                {garmentsList.map((item, index) => (
                  <Picker.Item key={index} label={item} value={item} />
                ))}
              </Picker>
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Descripción detallada"
            value={garment.description}
            onChangeText={(text) => updateGarment(gIndex, 'description', text)}
            multiline
          />

          <TextInput
            style={styles.input}
            placeholder="Observaciones"
            value={garment.observations}
            onChangeText={(text) => updateGarment(gIndex, 'observations', text)}
            multiline
          />

          <Text style={styles.sectionTitle}>Servicios:</Text>

          {garment.services.map((service, sIndex) => (
            <View key={sIndex} style={styles.serviceCard}>
              <View style={styles.row}>
                <Text style={styles.label}>Servicio:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={service.name}
                    onValueChange={(value) => updateService(gIndex, sIndex, 'name', value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Seleccione..." value="" />
                    {servicesList.map((item, index) => (
                      <Picker.Item key={index} label={item.name} value={item.name} />
                    ))}
                  </Picker>
                </View>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Descripción del servicio"
                value={service.description}
                onChangeText={(text) => updateService(gIndex, sIndex, 'description', text)}
              />

              <View style={styles.row}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Precio:</Text>
                  <TextInput
                    style={styles.input}
                    value={service.unitPrice?.toString() || ''}
                    onChangeText={(text) => updateService(gIndex, sIndex, 'unitPrice', text)}
                    keyboardType="numeric"
                    placeholder="Precio"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Cantidad:</Text>
                  <TextInput
                    style={styles.input}
                    value={service.quantity?.toString() || '1'} // Valor por defecto
                    onChangeText={(text) => updateService(gIndex, sIndex, 'quantity', text)}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Pressable
                style={styles.removeButton}
                onPress={() => removeService(gIndex, sIndex)}
              >
                <Text style={styles.removeButtonText}>Eliminar Servicio</Text>
              </Pressable>
            </View>
          ))}

          <Pressable
            style={styles.addButton}
            onPress={() => addService(gIndex)}
          >
            <Text style={styles.addButtonText}>+ Agregar Servicio</Text>
          </Pressable>

          <Pressable
            style={styles.removeButton}
            onPress={() => removeGarment(gIndex)}
          >
            <Text style={styles.removeButtonText}>Eliminar Prenda</Text>
          </Pressable>
        </View>
      ))}

      <Pressable
        style={styles.addButton}
        onPress={onAddGarment}
      >
        <Text style={styles.addButtonText}>+ Agregar Prenda</Text>
      </Pressable>

      <Pressable
        style={styles.submitButton}
        onPress={onSubmit}
      >
        <Text style={styles.submitButtonText}>Revisar y Guardar</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  garmentCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee'
  },
  serviceCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginVertical: 8
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  label: {
    marginRight: 8,
    width: 100
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8
  },
  picker: {
    width: '100%'
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 4
  },
  addButton: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#bbdefb'
  },
  addButtonText: {
    color: '#1976d2',
    fontWeight: '500'
  },
  removeButton: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ef9a9a'
  },
  removeButtonText: {
    color: '#d32f2f',
    fontWeight: '500'
  },
  submitButton: {
    backgroundColor: '#2e7d32',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default GarmentList;