import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { bookings, clients, dashboardSummary, getClientById, getServiceById, getTechnicianById } from "@nails/core";

const plannedBookings = bookings.slice(0, 3);
const vipClients = clients.filter((client) => client.vip);

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerCard}>
          <Text style={styles.eyebrow}>NailsOS Mobile</Text>
          <Text style={styles.title}>Agenda del salon en React Native</Text>
          <Text style={styles.copy}>
            Esta app esta preparada para seguir la operacion del dia y crecer hacia reservas, fichas y caja en movil.
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Citas hoy</Text>
            <Text style={styles.statValue}>{dashboardSummary.appointmentsToday}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Huecos</Text>
            <Text style={styles.statValue}>{dashboardSummary.availableSlots}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Proximas citas</Text>
          {plannedBookings.map((booking) => (
            <View key={booking.id} style={styles.listItem}>
              <Text style={styles.itemTitle}>
                {new Date(booking.start).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })} ·{" "}
                {getClientById(booking.clientId)?.name}
              </Text>
              <Text style={styles.itemCopy}>
                {getServiceById(booking.serviceId)?.name} con {getTechnicianById(booking.technicianId)?.name}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Clientas VIP</Text>
          {vipClients.map((client) => (
            <View key={client.id} style={styles.listItem}>
              <Text style={styles.itemTitle}>{client.name}</Text>
              <Text style={styles.itemCopy}>
                {client.favoriteColors.join(", ")} · {client.visits} visitas
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6efe6"
  },
  container: {
    padding: 20,
    gap: 16
  },
  headerCard: {
    backgroundColor: "#fff9f2",
    borderRadius: 28,
    padding: 24
  },
  eyebrow: {
    color: "#8e3f28",
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase"
  },
  title: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "700",
    color: "#251814",
    marginTop: 8
  },
  copy: {
    color: "#6d5750",
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22
  },
  statsRow: {
    flexDirection: "row",
    gap: 12
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 18
  },
  statLabel: {
    color: "#6d5750",
    fontSize: 13
  },
  statValue: {
    marginTop: 8,
    color: "#251814",
    fontSize: 28,
    fontWeight: "700"
  },
  sectionCard: {
    backgroundColor: "#fff9f2",
    borderRadius: 28,
    padding: 20,
    gap: 12
  },
  sectionTitle: {
    color: "#251814",
    fontSize: 20,
    fontWeight: "700"
  },
  listItem: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16
  },
  itemTitle: {
    color: "#251814",
    fontWeight: "700",
    fontSize: 16
  },
  itemCopy: {
    color: "#6d5750",
    marginTop: 6
  }
});
