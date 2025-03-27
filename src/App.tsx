import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";

import Sidebar from "./components/Sidebar";
import Header from "./components/Messages/Header";
import MyMessages from "./components/Messages/Messages";
import TwilioForm from "./components/Credentials/TwilioForm";
import { CredentialsProvider } from "./context/CredentialsContext";

export default function App() {
  return (
    <CredentialsProvider>
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <Box sx={{ display: "flex", minHeight: "100dvh" }}>
          <Router>
            <Sidebar />
            <Header />
            <Routes>
              <Route path="/messages" element={<MyMessages />} />
              <Route path="/" element={<TwilioForm />} />
            </Routes>
          </Router>
        </Box>
      </CssVarsProvider>
    </CredentialsProvider>
  );
}
