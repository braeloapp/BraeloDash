"use client";
import React, { useState } from "react";
import { FaRegSmile, FaPaperclip, FaTimes, FaWindowMinimize } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

export default function ChatModal({ isOpen, onClose }) {
  const [message, setMessage] = useState(""); // State to track message input
  const [isMinimized, setIsMinimized] = useState(false); // State to track if modal is minimized

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-20 flex justify-end z-50 items-end">
      {/* Modal container with dynamic height based on minimized state */}
      <div
        className={`bg-[#f6f8fb] rounded-lg w-1/3 p-5 transition-all duration-300 ${
          isMinimized ? "h-16" : "h-auto"
        }`}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-[#818592] text-[16px] font-[400] ">
            {isMinimized ? "New Message" : "New Message"}
          </h2>

          <div className="flex items-center space-x-3">
            {/* Minimize Button */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-400 hover:text-gray-800"
            >
              <FaWindowMinimize className="w-4 h-4 flex mb-1" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-800"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conditional rendering based on minimize state */}
        {!isMinimized && (
          <>
            {/* Subject Input */}
            <div className="mb-4 border-b py-2">
              <h1 className="text-[#818592] text-[16px] font-[400] ">
                To:<span className="ml-1 text-[14px]"></span> kendajenner@mail.com
              </h1>
            </div>

            {/* Topic and Message Preview */}
            <div className="border-b pb-3 mb-4">
              <h2 className="text-[#1C1F26] text-[20px] font-[400]  mb-2">
                Topic Subject
              </h2>
              <div className="h-[200px]">
              <p className="text-[#1C1F26] text-[16px] font-[400] ">
                {message || ""}
              </p>
              </div>
            </div>

            {/* Message Input with Icons */}
            <div className="relative">
              <input
                type="text"
                placeholder="Type a message"
                value={message} // Bind the input value to the message state
                onChange={(e) => setMessage(e.target.value)} // Update the state on input change
                className="w-full border h-[40px]   rounded-md px-3 py-2 text-gray-700 pr-16 focus:outline-none focus:ring-2 focus:ring-[#CD9403]"
              />

              {/* Icons: Smiley, Attachment, and Send Button */}
              <div className="absolute right-3 top-1 flex items-center space-x-3 z-10">
                <FaRegSmile className="text-gray-500 hover:text-gray-700 cursor-pointer" />
                <FaPaperclip className="text-gray-500 hover:text-gray-700 cursor-pointer" />
                <button className="bg-[#cd9403] text-white px-3 py-1 rounded-lg flex items-center text-[16px] font-[500] ">
                  Send <IoMdSend className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}