import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E88E5',  
        },
        headerTintColor: '#fff',       
        headerTitleStyle: {
          fontWeight: '600',           
          fontSize: 18,               
        },
        headerTitleAlign: 'center',   
        headerShadowVisible: true,     
        contentStyle: {
          backgroundColor: '#f5f5f5',  
        }
      }}
    />
  );
}