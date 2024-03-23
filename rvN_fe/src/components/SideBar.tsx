import { Button } from "@mui/material";
import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { AiOutlineBars } from "react-icons/ai";
import {Link, NavLink } from "react-router-dom";
import { FaCalendar,FaChartPie,FaHardDrive,FaSistrix,FaUser,FaUserGroup,FaPen,FaReceipt,FaHouse,FaBell  } from "react-icons/fa6";
import { useProfileStore } from "@/store/store";
const SideBar = () => {
  const [collapsed,setCollapsed] =useState(false)
  const handleCollapse=()=>{
    setCollapsed((prev)=>(!prev))
  }
 const role = useProfileStore((state)=>state.role)
  return (
    <Sidebar collapsed={collapsed} width="200px" transitionDuration={500} backgroundColor="#27303f" rootStyles={{color:"white",height:"100vh",borderWidth:'0px'}}>
      <div className="text-center py-4">
        <Button onClick={handleCollapse} style={{ color: 'white' }}><AiOutlineBars /></Button>
        
        {/* <div>Company Name</div> */}
      </div>
      <Menu
        menuItemStyles={{
          button: {
            // the active class will be added automatically by react router
            // so we can use it to style the active menu item
            [`&.active`]: {
              backgroundColor: "#313c4f",
              color: "#b6c8d9",
              borderRadius:"10px"
            },
            '&:hover': {
              backgroundColor: "#27303f",
              color: "gray",
              borderRadius: "10px"
            }
          },
          
        }}
      >
        

        <MenuItem component={<NavLink to="maps"/>} icon={<FaCalendar />}>Map</MenuItem>
        <MenuItem component={<NavLink to="charts" />} icon={<FaChartPie />}>Insights</MenuItem>
        <MenuItem component={<NavLink to="report" />} icon={<FaHardDrive />}>Report</MenuItem>
        <MenuItem component={<NavLink to="explore" />} icon={<FaSistrix />}>Explore</MenuItem>
        {role=="localauthority" && <MenuItem component={<NavLink to="cases" />} icon={<FaHardDrive />}>Cases</MenuItem>}
        {role=="localauthority" && <MenuItem component={<NavLink to="update-data" />} icon={<FaPen />}>Update Data</MenuItem>}
        {role=="localauthority" && <MenuItem component={<NavLink to="visitors" />} icon={<FaUserGroup />}>Visitors</MenuItem>}
        {role=="centeraladmin" && <MenuItem component={<NavLink to="all-cases" />} icon={<FaReceipt />}>Reported Cases</MenuItem>}
        {role=="centeraladmin" && <MenuItem component={<NavLink to="alerts" />} icon={<FaBell />}>Alerts</MenuItem>}
        {/* <MenuItem component={<NavLink to="profile" />} icon={<FaUser />}>Profile</MenuItem> */}
      </Menu>
    </Sidebar>
  );
};

export default SideBar;