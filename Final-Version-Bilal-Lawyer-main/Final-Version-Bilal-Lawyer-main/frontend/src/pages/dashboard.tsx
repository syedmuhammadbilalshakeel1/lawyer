"use client";
import { useEffect, useState, useRef } from "react";
import {
  Bell,
  ChevronDown,
  Info,
  LogOut,
  Users,
  Briefcase,
  Eye,
  MessageCircle,
  LayoutDashboard,
  FileText,
  UserPlus,
  Calendar,
  MessagesSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useOnClickOutside } from "@/hook/use-on-click-outside";
import { NotificationsDropdown } from "./../components/notifications-dropdown";

import UserProfile from "../components/userprofile";
import LawyerDashboard from "@/components/lawyerDashboard";
import Clients from "@/components/lawyerClients";
import AddUserCase from "@/components/addUserCase";
import JudgeCards from "@/components/judgeCards";
import MyCases from "@/components/myCases";
import AboutUs from "@/components/aboutUs";
import CaseManagement from "@/components/caseManagment";
import ClientCaseView from "@/components/client-view";
import { PaymentMethod } from "@/components/payment-method";
import LawyersPage from "@/components/lawyersDC";
import { JudgeTable } from "@/components/judge_table";
import AllCases from "@/components/allCases";
import axios from "axios";
import AdminCaseManagement from "@/components/adminCaseManagement";
import AdminDashboard from "@/components/adminDashboard";
import AdminJudgeTable from "@/components/adminJudgeTable";
import JudgeDashboard from "@/components/judgeDashboard";
import LawyerCaseView from "@/components/lawyerCaseView";
import ChatBot from "./chatbot";
import { LawyerCalendar } from "../components/calendar";
import { FAQ } from "../components/faq";
import { ClientFAQ } from "../components/clientfaq";
import { JudgeFAQ } from "../components/judgefaq";
import { AdminFAQ } from "../components/Adminfaq";

export default function Dashboard() {
  const [currentSection, setCurrentSection] = useState<string>("dashboard");
  const [role, setRole] = useState<string>("");

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
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }

    if (storedRole === "client") {
      setCurrentSection("LawyersPage");
    }
    if (storedRole === "lawyer") {
      setCurrentSection("dashboard");
    }
    if (storedRole === "judge") {
      setCurrentSection("judgeDashboard");
    }
    if (storedRole === "admin") {
      setCurrentSection("adminDashboard");
    }
  }, []);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(notificationRef, () => setIsNotificationsOpen(false));

  return (
    <div className="flex min-h-screen w-full">
      <aside className="w-64 shrink-0 bg-teal-950 text-white p-6 hidden md:block">
        <div className="mb-8">
          {/* <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          > */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-scale"
          >
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="M7 21h10" />
            <path d="M12 3v18" />
            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
          </svg>
          <path
            d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          {/* <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" /> */}
          {/* </svg> */}
        </div>
        <nav className="space-y-4">
          {role === "lawyer" && (
            <>
              <button
                onClick={() => setCurrentSection("dashboard")}
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setCurrentSection("allCases")}
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <FileText className="w-5 h-5" />
                <span>Client Cases</span>
              </button>
              <button
                onClick={() => setCurrentSection("LawyerCalendar")}
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <Calendar className="w-5 h-5" />
                <span>Calander</span>
              </button>

              <button
                onClick={() => setCurrentSection("addUserCase")}
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <UserPlus className="w-5 h-5" />
                <span>Add User Case</span>
              </button>
              <button
                onClick={() => setCurrentSection("LawyerCaseView")}
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <Eye className="w-5 h-5" />
                <span>Case view</span>
              </button>

              <button
                onClick={() => setCurrentSection("about")}
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <Info className="w-5 h-5" />
                <span>About Us</span>
              </button>
              <button
                onClick={() => setCurrentSection("FAQ")}
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <MessagesSquare className="w-5 h-5" />
                <span>FAQs</span>
              </button>
            </>
          )}

          {role === "admin" && (
            <>
              <button
                onClick={() => setCurrentSection("adminDashboard")}
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Admin Dashboard</span>
              </button>
              <button
                onClick={() => setCurrentSection("adminCaseManagement")}
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <Briefcase className="w-5 h-5" />
                <span>Case Management</span>
              </button>
              <button
                onClick={() => setCurrentSection("adminJudgeTable")}
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <Users className="w-5 h-5" />
                <span>Judge Table</span>
              </button>
              <button
                onClick={() => setCurrentSection("AdminFAQ")}
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <MessagesSquare className="w-5 h-5" />
                <span>FAQ</span>
              </button>
            </>
          )}

          {role === "client" && (
            <>
              <button
                onClick={() => setCurrentSection("LawyersPage")}
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <Users className="w-5 h-5" />
                <span>Lawyers</span>
              </button>
              <button
                onClick={() => setCurrentSection("myCases")}
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                <span>My Cases</span>
              </button>

              <button
                onClick={() => setCurrentSection("ClientCaseView")}
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <Eye className="mr-2 h-4 w-4" />
                <span>Case view</span>
              </button>
              <button
                onClick={() => setCurrentSection("about")}
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <Info className="mr-2 h-4 w-4" />
                <span>About Us</span>
              </button>
              <button
                onClick={() => setCurrentSection("ClientFAQ")}
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <MessagesSquare className="mr-2 h-4 w-4" />
                <span>FAQs</span>
              </button>

              <button
                onClick={() =>
                  window.open(
                    "https://chat-app-azrarch.onrender.com/",
                    "_blank"
                  )
                }
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                <span>Chat</span>
              </button>
            </>
          )}

          {role === "client" ||
            (role === "lawyer" && (
              <button
                onClick={() =>
                  window.open(
                    "https://chat-app-azrarch.onrender.com/",
                    "_blank"
                  )
                }
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat</span>
              </button>
            ))}

          {role === "judge" && (
            <>
              <button
                onClick={() => setCurrentSection("judgeDashboard")}
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Judge Dashboard</span>
              </button>

              <button
                onClick={() => setCurrentSection("CaseManagement")}
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <Briefcase className="w-5 h-5" />
                <span>Case Managment</span>
              </button>
              <button
                onClick={() => setCurrentSection("JudgeFAQ")}
                className="flex items-center space-x-2 w-full text-gray-300 hover:text-white hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
              >
                <MessagesSquare className="w-5 h-5" />
                <span>FAQs</span>
              </button>
            </>
          )}
        </nav>
      </aside>

      <main className="flex-1 w-full overflow-x-hidden p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            {/* <Search className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 w-64 rounded-md bg-white"
            /> */}
          </div>
          <div className="flex items-center space-x-4 ">
            <div className="relative" ref={notificationRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                aria-label="Toggle notifications"
              >
                <Bell className="h-5 w-5 text-teal-950" />
              </Button>

              {isNotificationsOpen && <NotificationsDropdown />}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 "
                >
                  <span className="text-teal-950">{userData.fullName}</span>
                  <ChevronDown className="h-4 w-4 " />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCurrentSection("profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/login";
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div
          className=" shadow rounded-lg p-6 w-full max-w-[2000px] mx-auto "
          style={{ backgroundColor: "#FFFBEF" }}
        >
          <ChatBot />
          {currentSection === "dashboard" && <LawyerDashboard />}
          {currentSection === "clients" && <Clients />}
          {currentSection === "LawyerCalendar" && <LawyerCalendar />}
          {currentSection === "allCases" && <AllCases />}
          {currentSection === "addUserCase" && <AddUserCase />}
          {currentSection === "profile" && <UserProfile />}
          {currentSection === "judgeCards" && <JudgeCards />}
          {currentSection === "myCases" && <MyCases />}
          {currentSection === "about" && <AboutUs />}
          {currentSection === "CaseManagement" && <CaseManagement />}
          {currentSection === "ClientCaseView" && <ClientCaseView />}
          {currentSection === "LawyerCaseView" && <LawyerCaseView />}
          {currentSection === "PaymentMethod" && <PaymentMethod />}
          {currentSection === "LawyersPage" && <LawyersPage />}
          {currentSection === "Judge_table" && <JudgeTable />}
          {currentSection === "adminDashboard" && <AdminDashboard />}
          {currentSection === "adminCaseManagement" && <AdminCaseManagement />}
          {currentSection === "adminJudgeTable" && <AdminJudgeTable />}
          {currentSection === "judgeDashboard" && <JudgeDashboard />}
          {currentSection === "FAQ" && <FAQ />}
          {currentSection === "ClientFAQ" && <ClientFAQ />}
          {currentSection === "JudgeFAQ" && <JudgeFAQ />}
          {currentSection === "AdminFAQ" && <AdminFAQ />}
        </div>
      </main>
    </div>
  );
}
