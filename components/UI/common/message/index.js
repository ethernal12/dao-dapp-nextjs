import { useState } from "react"
const TYPES = {
    success: "green",
    warning: "teal",
    danger: "red"
}

const BG_CLASS = {
    success: "bg-green-200",
    warning: "bg-teal-200",
    danger: "bg-red-200"
}

const TEXT_CLASS = {
    success: "bg-green-200",
    warning: "bg-teal-200",
    danger: "bg-red-200"
}


const SIZES = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

export default function Message({ children, type = "success", size = "md" }) {

   
   



    const messageType = TYPES[type]
    const messageSizeClass = SIZES[size]
   

    return (
        <div className={`${BG_CLASS[messageType]}rounded-xl mb-3`}>
            
                
                    <div className="w-0 flex-1 flex items-center">
                        <div className={`ml-3 ${messageSizeClass} font-medium ${TEXT_CLASS[messageType]}`}>
                            <span className=" md:inline">
                                {children}
                            </span>
                        </div>
                    </div>
                   
           
         
        </div>


    )
}