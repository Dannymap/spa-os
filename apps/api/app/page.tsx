export default function ApiHomePage() {
  return (
    <main style={{ fontFamily: "sans-serif", padding: "40px", lineHeight: 1.6 }}>
      <h1>NailsOS API</h1>
      <p>Backend serverless listo para desplegar como proyecto independiente en Vercel.</p>
      <ul>
        <li>/api/bookings</li>
        <li>/api/clients</li>
        <li>/api/services</li>
        <li>/api/dashboard</li>
      </ul>
    </main>
  );
}

