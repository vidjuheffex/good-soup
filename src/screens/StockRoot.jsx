import { Outlet, useLoaderData } from "react-router-dom"
import SidebarMenu from "../components/SidebarMenu"
import SidebarMenuGroup from "../components/SidebarMenuGroup"

export default () =>{
    const data = useLoaderData()

    return <div className="StockRoot">
        <SidebarMenu>
            <SidebarMenuGroup
            title="Recipes"
            createNewLink='create-development-recipe'
            items={data.developmentRecipes.map(i => ({...i, label: i.name}))}>
            </SidebarMenuGroup>
        </SidebarMenu>
    <Outlet />
    </div>
}