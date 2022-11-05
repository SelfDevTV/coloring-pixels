import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
