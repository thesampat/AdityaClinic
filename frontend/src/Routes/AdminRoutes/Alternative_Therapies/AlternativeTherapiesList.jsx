import { useEffect, useState } from "react";
import RightWrapper from "../../../Components/CommonComponents/ComponentWrapper";
import CustomTable from "../../../Components/CommonComponents/CustomTable";
import { SmallSwitchMenu } from "../../../Components/CommonComponents/SmallSwitchMenu";
import { useCheckRole, useGetLoggedInUser } from "../../../UtilityHookFunctions/LoggedInUser";
import { useNavigate } from "react-router-dom";

const main_head = ["therapy", "status"];
const custom_head = ["Therapy Requested", "Status"];

const OtherModificationButton=({item})=>{
    const navigate = useNavigate()
    return(
       <span>
       {(item?.status !== 'done'&&item?.status!=='bid') &&
        <span onClick={e=>{
             item?.status === 'treating'?navigate(`${item?._id}/update`):navigate(`${item?._id}`)
            }} className="bg-gray-100 cursor-pointer text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-gray-500">
          {"Update"}
        </span>}

        {console.log(item?.status, 'the status')}
        <span onClick={e=>{
             navigate(`/bids/${item?._id}`)
            }} className="bg-gray-100 cursor-pointer text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-gray-500">
          {"View"}
        </span>

        {item?.status === 'done' &&
        <span onClick={e=>{
          navigate(`${item?._id}/update`)
         }} className="bg-gray-100 cursor-pointer text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-gray-500">
       {"Check Result"}
     </span>}
         
       </span>
    )
}


let OptinsMenu = {'Treating':"treating", 'Requests':"request", "Completed":"done", "OnBid":"bid"}

const AlternativeTherapiesList = () => {
    const [selectmenu, setselectedmenu] = useState(localStorage.getItem('menu')||"Treating");
    const checkrole = useCheckRole()
    const user = useGetLoggedInUser()

    useEffect(()=>{
      localStorage.setItem('menu', selectmenu)
    }, [selectmenu])

  return (
    <RightWrapper>
        {checkrole('maindoctor') && <SmallSwitchMenu options={OptinsMenu} selectmenu={selectmenu} setselectedmenu={setselectedmenu}/>}
        {checkrole('maindoctor') &&  <CustomTable tablekeys={main_head} customHead={custom_head} fetchUrl={`alternative_therapy/list?`} Queries={{search:true, status:OptinsMenu[selectmenu]}} DeleteUrl={null} View={null} OtherModificationButton={OtherModificationButton}/>}
        {checkrole('consultant') &&  <CustomTable tablekeys={main_head} customHead={custom_head} fetchUrl={`alternative_therapy/list?`} Queries={{search:true, status:"Treating", consultant:user?._id}} DeleteUrl={null} View={null} OtherModificationButton={OtherModificationButton}/>}
    </RightWrapper>
  );
};

export default AlternativeTherapiesList;
