import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { storage } from "../api/firebase"; // Import Firebase storage
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // Import the Label component

// Import Firebase storage functions
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Form() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");
  const options = ["traffic", "garbage", "governmentOffice"];
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null); // Track image file

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false)
  };
  const handleImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setImageFile(file); // Store the selected file
  };

  const handleSubmit = async () => {
    try {
      if (!imageFile) {
        toast.error("Please select an image");
        return;
      }

      const storageRef = storage; // Use the storage reference directly
      const imageRef = ref(storageRef, imageFile.name); // Create a reference to the image file
      await uploadBytes(imageRef, imageFile); // Upload the image file

      // Get the download URL of the uploaded image
      const imageURL = await getDownloadURL(imageRef); // Ensure you're using the correct function to get the download URL

      if (!imageURL) {
        throw new Error("Failed to get download URL");
      }

      console.log("Image uploaded successfully:", imageURL); // Log the successful upload

      const formData = new FormData();
      formData.append("title", title);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("image", imageURL)
      formData.append("department", selectedOption); // Pass Firebase Storage URL instead of base64

      const response = await axios.post(
        "http://localhost:5000/user/postUserReports",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      toast.success("Reported the incident successfully");
    } catch (e) {
      console.error("Error submitting form:", e);
      toast.error("Failed to submit the form. Please try again later.");
    }
  };

  return (
    <div className="space-y-8 max-w-[800px]  ">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Report an Incident/Problem</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
          className="text-black"
            id="title"
            placeholder="An appropriate title describing the problem"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
          className="text-black"
            id="location"
            placeholder="Enter the place where the incident/problem occurred"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">
            Describe the Problem/Incident in detail
          </Label>
          <Input
          className="text-black"
            id="description"
            placeholder="Enter your message"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="relative text-left flex flex-col gap-2">
            <div>Select a department</div>
          <div>
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              onClick={() => setIsOpen(!isOpen)}
              aria-haspopup="true"
              aria-expanded="true"
            >
              {selectedOption || "Select an option"}
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 12l-8-8 1.5-1.5L10 9.086 16.5 1.5 18 3l-8 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {isOpen && (
            <div className=" right-0 mt-2  rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {options.map((option, index) => (
                  <button
                    key={index}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                    onClick={() => handleOptionSelect(option)}
                    role="menuitem"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Image</Label>
          <Input id="image" type="file" onChange={handleImage} />
        </div>
        <Button onClick={handleSubmit}>Report Problem</Button>
      </div>
    </div>
  );
}
