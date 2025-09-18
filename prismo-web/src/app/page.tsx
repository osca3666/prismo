export default function Home() {
  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto", fontFamily: "system-ui" }}>
      <h1>Prismo</h1>
      <p>This app works and it's amazing!</p>

      <section style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #ddd" }}>
        <h2 style={{ marginBottom: 12 }}>Creator Reviews</h2>

        <figure style={{ margin: "12px 0" }}>
          <blockquote style={{ margin: 0 }}>
            “i just used ur app to find costco pokemon cards. i'm gonna become a scalper”
          </blockquote>
          <figcaption style={{ color: "#666" }}>—  entrepreneur</figcaption>
        </figure>

        {/* <figure style={{ margin: "12px 0" }}>
          <blockquote style={{ margin: 0 }}>
            “saved me three aisle laps and one impulse rotisserie chicken.”
          </blockquote>
          <figcaption style={{ color: "#666" }}>— optimizer</figcaption>
        </figure> */}
{/* 
        <figure style={{ margin: "12px 0" }}>
          <blockquote style={{ margin: 0 }}>
            “finally a reason to open my email that isn’t ‘reset your password’.”
          </blockquote>
          <figcaption style={{ color: "#666" }}>— 9999 email notifications guy</figcaption>
        </figure> */}
      </section>
    </main>
  );
}
