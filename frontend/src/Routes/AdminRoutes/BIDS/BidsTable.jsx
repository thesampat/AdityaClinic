import { useState } from "react";
import RightWrapper from "../../../Components/CommonComponents/ComponentWrapper";
import CustomTable from "../../../Components/CommonComponents/CustomTable";
import { SmallSwitchMenu } from "../../../Components/CommonComponents/SmallSwitchMenu";
import { useCheckRole, useGetLoggedInUser } from "../../../UtilityHookFunctions/LoggedInUser";
import { useNavigate } from "react-router-dom";

const OtherModificationButton = ({ item }) => {
  
  const checkrole = useCheckRole()

  const navigate = useNavigate();
  return (
    <span>
      {checkrole('maindoctor') ?
      <span>
        <span onClick={e=>{
             navigate(`/bids/${item?.bidOn}`)
            }} className="bg-gray-100 cursor-pointer text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-gray-500">
          {"View Request"}
        </span>
        <span onClick={e=>{
             navigate(`review/${item?._id}`)
            }} className="bg-gray-100 cursor-pointer text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-gray-500">
          {"Review"}
        </span>
      </span>
        
        :
        <span
        onClick={(e) => {
          navigate(`${item?._id}/create`);
        }}
        className="bg-gray-100 cursor-pointer text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-gray-500"
      >
        {"Bid"}
      </span>
        }
     
    </span>
  );
};

let OptinsMenu = { Won: "treating", "Bid Requests": "bid" };
let ConsultantMenu = { "My Bids": "my_bids", "Bids": "bid" };

const BidsTable = ({ options }) => {
  const checkrole = useCheckRole();
  const user = useGetLoggedInUser();
  const [selectmenu, setselectedmenu] = useState(checkrole('maindoctor')?'BidRequests':"Bids");

  let main_head;
  let custom_head;

  let bids_main_head
  let bids_custom_head

  if (!checkrole('maindoctor')) {
    main_head = ["bidPrice", "duration"];
    custom_head = ["Bid Price", "Duration"];
    
    bids_main_head = ["therapy", "duration", "note"]
    bids_custom_head = ["Therapy", "Duration", 'Note']

    main_head = selectmenu === 'Bids'?bids_main_head:main_head
    custom_head = selectmenu === 'Bids'?bids_custom_head:custom_head

  } else {
    main_head = ["bidPrice", "duration", "bidder_name"];
    custom_head = ["Price", "Duration", "Consultant"];
  }

  const Queries = { search: true, status: OptinsMenu?.[selectmenu] };

  if (!checkrole("maindoctor")) {
    Queries["therapy"] = user?.typeOfConsultant;
    Queries['status'] = 'bid'
  }


  return (
    <RightWrapper>
      {checkrole("maindoctor") && <SmallSwitchMenu options={OptinsMenu} selectmenu={selectmenu} setselectedmenu={setselectedmenu} />}
      {checkrole("consultant") && <SmallSwitchMenu options={ConsultantMenu} selectmenu={selectmenu} setselectedmenu={setselectedmenu} />}
      { checkrole('maindoctor') && <CustomTable tablekeys={main_head} customHead={custom_head} fetchUrl={`bid?`} Queries={Queries} DeleteUrl={false} View={false} OtherModificationButton={OtherModificationButton} />}
      {!checkrole('maindoctor') && <CustomTable tablekeys={main_head} customHead={custom_head} fetchUrl={selectmenu=='Bids'?`alternative_therapy/list?`:`bid/mybids/${user?._id}`} Queries={Queries} DeleteUrl={false} View={"View"} OtherModificationButton={OtherModificationButton} />}
    </RightWrapper>
  );
};

export default BidsTable;
