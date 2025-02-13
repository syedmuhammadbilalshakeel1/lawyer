"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AddUserCase() {
  const [state, setState] = useState({
    clientName: "",
    lawyerName: "",
    email: "",
    phoneNumber: "",
    judgeType: "",
    priority: "",
    caseType: "",
    caseDescription: "",
  });

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const stateData = {
      clientName: state.clientName,
      lawyerName: userData.fullName,
      email: state.email,
      phoneNumber: state.phoneNumber,
      judgeType: state.judgeType,
      priority: state.priority,
      caseType: state.caseType,
      caseDescription: state.caseDescription,
    };

    console.log("submit data:stateData ", stateData);
    const res = await axios.post(`/api/api/lawyerFormSubmit`, stateData);
    console.log("🚀 ~ handleSubmit ~ res:", res);

    try {
      const userID = localStorage.getItem("userId");
      const response = await axios.post(
        `/api/api/saveNotification/${userID}/679bbf6f75767ffcb331b46b`,
        {
          senderName: userData.fullName,
          receiverName: "Admin",
          caseType: "caseType",
          senderEmail: userData.email,
          senderPhoneNum: userData.phoneNumber,
          caseDescription: "caseDescription",
        }
      );
    } catch (error: any) {
      console.log("Error");
    }

    // Reset state to clear input fields after submit
    setState({
      clientName: "",
      lawyerName: "",
      email: "",
      phoneNumber: "",
      judgeType: "",
      priority: "",
      caseType: "",
      caseDescription: "",
    });
  };

  const [userData, setUserData] = useState<any>({
    fullName: "John Doe",
    email: "john@example.com",
    phoneNumber: "+1 (555) 000-0000",
    password: "xxxxxxxx",
    userType: "client",
  });

  useEffect(() => {
    const ID = localStorage.getItem("userId");
    axios
      .get(`/api/api/getUserProfile/${ID}`)
      .then((response) => {
        setUserData(response.data.data);
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err.message);
      });
  }, []);

  return (
    <>
      <div className="space-y-12">
        <div className="border-b border-gray-300 pb-6">
          <h2 className="text-lg font-semibold leading-7 text-gray-900">
            User Case Invoice
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Fill in the details to send user case information.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1">
          {/* First Name */}
          <div className="col-span-1">
            <label
              htmlFor="clientName"
              className="block text-sm font-medium text-gray-700"
            >
              Client Name
            </label>
            <input
              id="clientName"
              name="clientName"
              type="text"
              placeholder="John"
              value={state.clientName}
              onChange={handleInputChange}
              className="mt-2 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all duration-300 ease-in-out hover:border-indigo-400"
            />
          </div>

          {/* Lawyer Name */}
          <div className="col-span-1">
            <label
              htmlFor="lawyerName"
              className="block text-sm font-medium text-gray-700"
            >
              Lawyer Name
            </label>
            <input
              id="lawyerName"
              name="lawyerName"
              type="text"
              placeholder="Doe"
              value={userData.fullName}
              onChange={handleInputChange}
              disabled
              className="mt-2 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all duration-300 ease-in-out hover:border-indigo-400"
            />
          </div>

          {/* Email */}
          <div className="col-span-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={state.email}
              onChange={handleInputChange}
              className="mt-2 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all duration-300 ease-in-out hover:border-indigo-400"
            />
          </div>

          {/* Phone Number */}
          <div className="col-span-1">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="1234567890"
              value={state.phoneNumber}
              onChange={handleInputChange}
              className="mt-2 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all duration-300 ease-in-out hover:border-indigo-400"
            />
          </div>

          {/* Judge Type */}
          <div className="col-span-1">
            <label
              htmlFor="judgeType"
              className="block text-sm font-medium text-gray-700"
            >
              Judge Type
            </label>
            <select
              id="judgeType"
              name="judgeType"
              value={state.judgeType}
              onChange={handleInputChange}
              className="mt-2 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Judge Type</option>
              <option value="Supreme Court">Supreme Court</option>
              <option value="High Court">High Court</option>
              <option value="Federal Court">Federal Court</option>
            </select>
          </div>
          {/* Pruority */}
          <div className="col-span-1">
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={state.priority}
              onChange={handleInputChange}
              className="mt-2 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Case Type */}
          <div className="col-span-1">
            <label
              htmlFor="caseType"
              className="block text-sm font-medium text-gray-700"
            >
              Case Type
            </label>
            <input
              id="caseType"
              name="caseType"
              type="text"
              placeholder="Civil, Criminal, etc."
              value={state.caseType}
              onChange={handleInputChange}
              className="mt-2 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all duration-300 ease-in-out hover:border-indigo-400"
            />
          </div>

          {/* Case Description */}
          <div className="col-span-full">
            <label
              htmlFor="caseDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Case Description
            </label>
            <textarea
              id="caseDescription"
              name="caseDescription"
              rows={4}
              placeholder="Provide a detailed description of the case."
              value={state.caseDescription}
              onChange={handleInputChange}
              className="mt-2 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all duration-300 ease-in-out hover:border-indigo-400"
            ></textarea>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 ease-in-out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 inline mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
            Save & Send
          </button>
        </div>
      </div>
    </>
  );
}
