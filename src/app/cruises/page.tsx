import { CruiseDetailsModal } from "@/components/cruise/CruiseDetailsModal";
import { CruiseFilters } from "@/components/cruise/CruiseFilters";
import { CruiseMap } from "@/components/cruise/CruiseMap";
import { CruiseResults } from "@/components/cruise/CruiseResults";
import { CruiseSearch } from "@/components/cruise/CruiseSearch";
import { MobileFiltersSheet } from "@/components/cruise/MobileFiltersSheet";

export default function CruisesPage() {
  return (
    <main className="flex flex-1 flex-col bg-background">
      <CruiseSearch />

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:py-12">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Cruises on the Map</h2>
          <p className="text-sm text-muted-foreground">Click a pin to see that cruise&apos;s details</p>
        </div>
        <CruiseMap />
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16">
        <div className="mb-4">
          <MobileFiltersSheet />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <CruiseFilters />
            </div>
          </aside>
          <CruiseResults />
        </div>
      </section>

      <CruiseDetailsModal />
    </main>
  );
}
