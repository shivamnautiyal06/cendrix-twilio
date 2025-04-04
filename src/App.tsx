import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CssVarsProvider } from "@mui/joy/styles";
import { CssBaseline, Box } from "@mui/joy";

import Sidebar from "./components/Sidebar";
import Header from "./components/Messages/Header";
import Messages from "./components/Messages/Messages";
import TwilioForm from "./components/Credentials/TwilioForm";
import Banner from "./components/Banner";
import Pages from "./components/Pages";
import { CredentialsProvider } from "./context/CredentialsContext";

export default function App() {
  return (
    <CredentialsProvider>
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <Router>
          <Pages>
            <Box
              sx={{ display: "flex", minHeight: "100dvh", overflow: "hidden" }}
            >
              <Banner />
              <Sidebar />
              <Header />
              <Routes>
                <Route path="/messages" element={<Messages />} />
                <Route path="/" element={<TwilioForm />} />
              </Routes>
            </Box>
          </Pages>
        </Router>
      </CssVarsProvider>
    </CredentialsProvider>
  );
}
