import Cards from "../../components/cards";
import AddDonationForm from "../../components/donationForm";
import AddDonationFormKinds from "../../components/donationFormKinds";
import AddDonationFormIMPS from "../../components/donationFormIMPS";
import { useState } from "react";
function Dashboard() {
  const [isdonationType, setisDonationType] = useState("money");
  // const [isdonationListTypeMoney, setisDonationListTypeMoney] = useState(true);
  return (
    <>
      <Cards></Cards>
      <div className="mt-20  ">
        <div className="flex  space-x-16 px-6">
          <button
            className={`${
              isdonationType === "money" ? " text-blue-600" : "text-black"
            }   font-normal`}
            onClick={() => setisDonationType("money")}
          >
            {" "}
            Cash / Online Donation
          </button>
          <button
            className={`${
              isdonationType === "imps" ? " text-blue-600" : "text-black"
            }   font-normal`}
            onClick={() => setisDonationType("imps")}
          >
            {" "}
            IMPS
          </button>
          <button
            className={`${
              isdonationType === "kinds" ? " text-blue-600" : "text-black"
            }   font-normal`}
            onClick={() => setisDonationType("kinds")}
          >
            {" "}
            Material Donation
          </button>{" "}
        </div>
        <hr className=" border-slate-400 mt-2"></hr>
      </div>
      {isdonationType === "money" ? (
        <AddDonationForm></AddDonationForm>
      ) : isdonationType === "kinds" ? (
        <AddDonationFormKinds></AddDonationFormKinds>
      ) : isdonationType === "imps" ? (
        <AddDonationFormIMPS></AddDonationFormIMPS>
      ) : null}
    </>
  );
}

export default Dashboard;
