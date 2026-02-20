import { AppNavbar } from "../components/AppNavbar";
import { MarketplaceScene } from "../components/MarketplaceScene";

export default function MarketplacePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppNavbar />
      <main className="flex-1">
        <MarketplaceScene />
      </main>
    </div>
  );
}
