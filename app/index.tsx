import Home from "@/components/Home";
import { OwnerProvider } from "./context/OwnerContext";

export default function Page() {
  return (
    <OwnerProvider>
      <Home />
    </OwnerProvider>
  );
}
