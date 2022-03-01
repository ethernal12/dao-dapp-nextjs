import Link from "next/link"
import React from "react"
import { useRouter } from "next/router"

export default function ActiveLink({children, ...props}) {

    let className = children.props.className || ""
    const {pathname} = useRouter()

    if(pathname === props.href){

        className = `${className} text-yellow-500`
    }
    return(


        <Link
        {...props}
        >
            {React.cloneElement(children,{className})}
        
        </Link>
    )
}