"use client";

import OffersProvider from "@/components/crud/context/OffersContext";
import OffersSidebar from "@/components/crud/sidebar/OffersSidebar";
import OffersToolbar from "@/components/crud/toolbar/OffersToolbar";
import OffersTableSection from "@/components/crud/table/OffersTableSection";

export default function Page() {
  return (
    <OffersProvider>
      <div className="flex min-h-screen bg-gray-100">
        <OffersSidebar />

        <div className="flex-1 flex flex-col">
          <OffersToolbar />

          <OffersTableSection />
        </div>
      </div>
    </OffersProvider>
  );
}
