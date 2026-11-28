// The Price profile page: a banner and the table of customer profiles.
import AddProductHeader from "./components/add-product-header";
import PriceProfileBanner from "./components/price-profile-banner";
import PriceProfileTable from "./components/price-profile-table";
import PriceProfileCards from "./components/price-profile-cards";

export default function PriceProfilePage() {
  return (
    <div className="flex flex-col gap-[31px] px-1 pb-10 sm:px-0 lg:gap-[42px] lg:pb-0">
      {/* the back button goes to the products list, mobile says "Price profiles" */}
      <AddProductHeader
        label="Stock"
        title="Price profile"
        mobileTitle="Price profiles"
        backTo="back"
      />

      <div className="flex flex-col gap-[17.854px]">
        <PriceProfileBanner />
        <PriceProfileTable />
        <PriceProfileCards />
        
      </div>
    </div>
  );
}