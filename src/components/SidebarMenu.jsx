import React from "react"
import "./SidebarMenu.css"
import SidebarMenuGroup from "./SidebarMenuGroup"

export default ({children, submenu}) => {
    return <>
    <div className="SidebarMenu">
        {children}
    </div>
    {submenu}
    </>
}