import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import Modal from "react-modal";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { AssignedReport, updayeStatus } from "@/api";
import toast from "react-hot-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    maxWidth: "400px",
    margin: "auto",
    padding: "20px",
    borderRadius: "8px",
  },
};

const ReportModal = ({
  reportId,
  title,
  description,
  status = "pending",
  createdBy,
  image, // Assuming imageURL is the property that holds the base64-encoded image URL
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [spam, setspam] = useState("");
  const navigate = useNavigate();
  console.log("Image data:", image);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const handleChat = () => {
    navigate(`/dash/chat/${createdBy}`);
  };

  const handleAccept = async () => {
    try {
      const response = await updayeStatus(reportId, { status: "accepted" });
      toast.success("Report Status updated Successfully");
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async () => {
    try {
      const response = await updayeStatus(reportId, { status: "rejected" });
      toast.success("Report Status updated Successfully");
    } catch (e) {
      console.error(e);
    }
  };

  const handleAssign = async () => {
    try {
      const response = await AssignedReport(reportId);
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  };

  // Function to get MIME type from buffer data
  const getMimeType = (buffer) => {
    const uint = new Uint8Array(buffer.data);
    let bytes = [];
    uint.forEach((byte) => {
      bytes.push(byte.toString(16));
    });
    const hex = bytes.join("").toUpperCase();

    // Check the file signature to determine the MIME type
    if (hex.startsWith("FFD8FFE0")) {
      return "image/jpeg";
    } else if (hex.startsWith("89504E47")) {
      return "image/png";
    } else {
      return "image/jpeg"; // Default to JPEG if the format is unknown
    }
  };

  // Convert buffer data to base64-encoded string
  const bufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer.data);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decodeBase64 = (base64String) => {
    return atob(base64String);
  };

  // Render the image using base64 string
  const base64Image = image && {
    src: `${bufferToBase64(image)}`,
  };

  console.log("Base64 Image:", base64Image);

  const decodedString = decodeBase64(base64Image.src);
  console.log(decodedString);
  useEffect(() => {
    const detectSpam = async () => {
      try {
        const inputText = `This is a grevience report for a muncipal corporation.Reply with only a yes or no if this is a potential spam or not.Classify it as not a spam only if it has detailed description of the grevience.Reply with a yes or a no.This is the Title and the description of a grevience report.  Title:${title} Description:${description}`;
        const result = await model.generateContent(inputText);
        const text = result.response.text();
        console.log("gemini response", text);
        setspam(text);
      } catch (e) {
        console.log(e);
      }
    };
    detectSpam();
  }, []);
  return (
    <Card className="flex p-6 min-w-[800px] relative rounded-xl overflow-hidden bg-white shadow-lg backdrop-blur-lg bg-opacity-40">
      <div className="flex justify-between w-full items-center">
        <div className="ml-6 flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm">{description}</p>
        </div>
        <div>
          <a href="#" onClick={openModal}>
            Details
          </a>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={modalStyles}
            contentLabel="Example Modal"
            className="backdrop-blur-2xl bg-white bg-opacity-80 min-w-[600px] min-h-[500px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div style={{ position: "absolute", top: "10px", right: "10px" }}>
              <button
                onClick={closeModal}
                style={{ fontSize: "20px", fontWeight: "bold" }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                paddingBottom: "20px",
                paddingTop: "10px",
                fontSize: "30px",
              }}
            >
              <h2>{title}</h2>
              {image && (
                <div style={{ textAlign: "center" }}>
                  <img
                    src={decodedString}
                    alt="Report Image"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      margin: "0 auto",
                    }}
                  />
                </div>
              )}
              <p className="text-sm">{description}</p>
              <div className="text-sm text-[#ea563c] font-bold">
                {spam.toLowerCase() === "yes" ? "This report is a potential Spam" : "This report is not a potential Spam"}
              </div>
            </div>
            <div>
              {status === "pending" ? (
                <div
                  className="flex mb-[50px] gap-3
                max-w-[100px]"
                >
                  <Button onClick={handleAccept}>Accept</Button>
                  <Button onClick={handleReject}>Reject</Button>
                </div>
              ) : (
                <></>
              )}
            </div>
            <div
              style={{ position: "absolute", bottom: "20px" }}
              className="flex gap-3 justify-between"
            >
              {status === "accepted" && (
                <Button onClick={handleAssign}>
                  Assign to Local Authority
                </Button>
              )}
              <Button onClick={handleChat}>Chat With the Volunteer</Button>
            </div>
          </Modal>
        </div>
      </div>
    </Card>
  );
};

export default ReportModal;
