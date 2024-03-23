import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AreaCharts from "@/components/AreaCharts";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import DepartmentCard from "@/components/DepartmentCard";

const Homepage = () => {
  const navigate = useNavigate();
  const options1 = ["traffic", "water", "fire", "police", "PWD"];
  const options = [
    {
      title: "Traffic Department",
      content: "This is the traffic department of the city.",
      footer: "Contact",
    },
    {
      title: "Water Department",
      content: "This is the water department of the city.",
      footer: "Contact",
    },
    {
      title: "Fire Department",
      content: "This is the fire department of the city.",
      footer: "Contact",
    },
    {
      title: "Police Department",
      content: "This is the police department of the city.",
      footer: "Contact",
    },
    {
      title: "Public Works Department",
      content: "This is the PWD department of the city.",
      footer: "Contact",
    },
  ];

  const handleLogout = async () => {
    try {
      // Make a POST request to your backend logout endpoint
      const response = await axios.post("http://localhost:5000/auth/logout"); // Replace with your actual backend URL

      // Check if the logout was successful
      if (response.status === 200) {
        // Clear the token from local storage
        localStorage.clear();

        // Redirect or navigate to the login page
        //navigate('/login'); // Change '/login' to your actual login page route
      } else {
        // Handle unsuccessful logout
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className="w-full h-full bg-gradient-to-b from-[#1f2937] via-[#334154] to-[#73849c] bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1494216928456-ae75fd96603d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
        }}
      >
        <section className="w-full py-12 md:py-24 ">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                {/* <h1 className="text-[#67666b] text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Green Eye
            </h1> */}
                <h1 className="text-[#67666b] text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Seva Sankalp
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Post, track and know about the Various greviences around you
                </p>
              </div>
              <Link
                className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-4 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                to="/signup"
              >
                Explore Now
              </Link>
              <Link to="/auth-signin">
                <Button>Sign in as Local Authority</Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center items-center h-full mt-10">
            <div className="grid grid-cols-3 gap-20">
              {options.map((item, index) => (
                <DepartmentCard key={index} title={item.title} content={item.content} footer={item.footer}/>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Homepage;
