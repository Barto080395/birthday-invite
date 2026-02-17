import Home from "@/components/Home";
import { OwnerProvider } from "./context/OwnerContext";
import { ThemeProvider } from "./context/ThemeContext";

export default function Page() {
  return (
    <OwnerProvider>
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    </OwnerProvider>
  );
}
