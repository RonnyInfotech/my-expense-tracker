import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { MyProSidebarProvider } from "./pages/global/sidebar/sidebarContext";
import Topbar from "./pages/global/Topbar";
import "primereact/resources/themes/nano/theme.css";
import "../node_modules/primeflex/primeflex.css";
import "../node_modules/primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import Dashboard from "./pages/dashboard";
import Form from "./pages/form";
import Calendar from "./pages/calendar";
import Expense from "./pages/Expense/Expense";
import Income from "./pages/Income/Income";
import AllTransactions from "./pages/AllTransactions/AllTransactions";
import ExpenseContextProvider from "./contexts/ExpenseContext";

const App = () => {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ExpenseContextProvider>
          <MyProSidebarProvider>
            <div style={{ height: "100%", width: "100%" }}>
              <main>
                <Topbar />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/income" element={<Income />} />
                  <Route path="/expense" element={<Expense />} />
                  <Route path="/allTransactions" element={<AllTransactions />} />
                  <Route path="/form" element={<Form />} />
                  <Route path="/calendar" element={<Calendar />} />
                </Routes>
              </main>
            </div>
          </MyProSidebarProvider>
        </ExpenseContextProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
