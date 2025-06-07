import { useRouter, useSearchParams } from 'expo-router/build/hooks';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function DeleteClientScreen() {
    const router = useRouter()
    const params = useSearchParams()
    const id = params.get("id")
    console.log("ID recibido:", id)


    const delClient = async () => {

        if (!id) {
            Alert.alert("error", "ID no encontrado")
            return;
        }

        try {
            const response = await fetch(`https://5q79hxmw-5000.usw3.devtunnels.ms/clients/delete/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            })

            const data = await response.json()

            if (response.ok) {
                Alert.alert("exito", "cliente borrado correctamente")
                console.log(data);
                router.push("/clientes")
            } else {
                Alert.alert("error", "No se pudo borrar el cliente")
            }
        } catch (error) {
            Alert.alert("error en el servidor")
            console.log("error:", error)
        }
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Eliminar Cliente</Text>
                <Text style={styles.label}>ID: {id}</Text>
                <Pressable style={styles.send} onPress={delClient}>
                    <Text style={styles.textButton}>Eliminar</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 30,
        marginTop: 30,
        fontWeight: "bold",
        margin: 15,
        marginLeft: 1
    },
    label: {
        marginTop: 15,
        fontSize: 20,
        fontWeight: "bold",
    },
    input: {
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "gray",
        fontSize: 20,
        paddingHorizontal: 10,
        marginVertical: 15,
        backgroundColor: "white",
    },
    send: {
        backgroundColor: "red",
        borderRadius: 10,
        marginTop: 15,
        alignItems: "center",
        paddingVertical: 10,
        width: 300
    },
    textButton: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
});
