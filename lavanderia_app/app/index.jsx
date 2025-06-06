import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
//holaaaa
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Que quieres hacer?</Text>
        <Pressable style={styles.send}>
          <Link href="/login" style={styles.textButton}>Login</Link>
        </Pressable>
        <Pressable style={styles.send}>
          <Link href="/usuarios/createU" style={styles.textButton}>Regist</Link>
        </Pressable>
        <Pressable style={styles.send}>
          <Link href={"/clientes"} style={styles.textButton}>Ver Clientes</Link>
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
    marginTop: 70,
    fontWeight: "bold",
    margin: 15
  },
  label: {
    marginTop: 20,
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
    backgroundColor: "blue",
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
    paddingVertical: 10,
    width:300
  },
  recover: {
    backgroundColor: "darkred",
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
    paddingVertical: 10,
    padding: 15
  },
  textButton: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  containerFooter: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 20,
    margin: 5,
  },
});
