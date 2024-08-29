import { useState } from "react";

export const SmallSwitchMenu=({options, selectmenu ,setselectedmenu})=>{
    return(
        <div className="main-navigation-switch">
        <div className="employee-navigation flex w-fit rounded-lg gap-2">
          {Object.keys(options)?.map((e) => {
            return (
              <button id={e} onClick={(i) => setselectedmenu(e)} className={`rounded-lg ${selectmenu == e ? "bg-blue-400" : "bg-blue-200"}`}>
                <h4 className="py-2 px-4 rounded-md">{e}</h4>
              </button>
            );
          })}
        </div>
      </div>
    )
    
}
