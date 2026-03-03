export const metadata = {
  title: "Sangha Registration",
  description: "Sangha Portal Form",
};

export default function RootLayout({ children }) {
  return (
    <html lang="kn">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#eeeeee",
          fontFamily: "Roboto, sans-serif"
        }}
      >
        {children}
      </body>
    </html>
  );
}