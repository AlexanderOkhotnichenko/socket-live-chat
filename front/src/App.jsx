import React from "react";
import { ThemeProvider } from "./context/ThemeProvider";
import { MainProvider } from "./context/MainProvider";
import { ToastContainer } from "react-toastify";
import { Main } from "./components/Main";
import { Container } from "./components/Container";
import { routes } from "./routes";
import styles from "./index.module.scss";

function App() {
  return (
    <ThemeProvider>
      <MainProvider>
        <Main className="flex-full flex items-center justify-center h-full">
          <Container className={styles.container}>
            {routes()}
            <ToastContainer />
          </Container>
        </Main>
      </MainProvider>
    </ThemeProvider>
  );
}

export default App;
