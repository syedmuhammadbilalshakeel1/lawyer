"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const router = useRouter();

  const [state, setState] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "client",
    termsAccepted: false,
    lawyerField: "",
    experience: "",
    judgeField: "",
  });

  const [activeTab, setActiveTab] = useState("Client");
  const [errors, setErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [otpFieldVisible, setOTPFieldVisible] = useState(false);
  const [signupFieldVisible, setSignupFieldVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: any) => {
    setState((prevState) => ({
      ...prevState,
      termsAccepted: checked,
    }));
  };

  const validateForm = () => {
    const formErrors: any = {};

    if (!state.fullName) formErrors.fullName = "Full Name is required.";
    if (!state.email) formErrors.email = "Email is required.";
    if (!state.phoneNumber)
      formErrors.phoneNumber = "Phone Number is required.";
    if (!state.password) formErrors.password = "Password is required.";
    if (!state.confirmPassword)
      formErrors.confirmPassword = "Confirm Password is required.";
    if (state.password !== state.confirmPassword)
      formErrors.passwordMatch = "Passwords do not match.";
    if (!state.termsAccepted)
      formErrors.termsAccepted = "You must accept the terms and conditions.";

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(state.password)) {
      formErrors.password =
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.";
    }

    return formErrors;
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    try {
      const res = await axios.post(`/api/api/register`, state);
      if (res.status === 201) {
        router.push("/login");
        setSuccessMessage("Registration successful!");
      }
    } catch (error) {
      console.error("Signup failed: ", error);
      setErrors({ submit: "Something went wrong. Please try again." });
    }
  };

  const [otpState, setOtpState] = useState<{ otp: string }>({ otp: "" });

  const handleOTPInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtpState({ otp: event.target.value });
  };

  const handleSendOTP = async () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;
    try {
      const res = await axios.post(`/api/api/sendOTP`, { email: state.email });
      if (res.status === 200) {
        setOTPFieldVisible(true);
      }
    } catch (error) {
      console.error("Signup failed: ", error);
      setErrors({ submit: "Something went wrong. Please try again." });
    }
  };
  const handleVerifyOTP = async () => {
    try {
      const res = await axios.post(`/api/api/verifyOTP`, {
        email: state.email,
        otp: otpState.otp,
      });
      if (res.status === 200) {
        setSignupFieldVisible(true);
        console.log("OTP Verifying Successfully:", otpState.otp);
      }
    } catch (error) {
      console.error("Signup failed: ", error);
      setErrors({ submit: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="relative min-h-screen flex">
      <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg-white">
        <div
          className="sm:w-1/2 xl:w-3/5 h-full hidden md:flex flex-auto items-center justify-center p-10 overflow-hidden bg-purple-900 text-white bg-no-repeat bg-cover relative"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)",
          }}
        >
          <div className="absolute bg-gradient-to-b from-indigo-600 to-blue-500 opacity-75 inset-0 z-0"></div>
          <div className="w-full max-w-md z-10">
            <div className="sm:text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Join Our Legal Community
            </div>
            <div className="sm:text-sm xl:text-md text-gray-200 font-normal">
              Welcome to our comprehensive legal management platform. Whether
              you're a client seeking legal assistance, a lawyer looking to
              expand your practice, or a judge managing cases, we provide the
              tools and connections you need for efficient legal services
              delivery.
            </div>
          </div>
        </div>

        <div className="md:flex md:items-center md:justify-center sm:w-auto md:h-full w-2/5 xl:w-2/5 p-8 md:p-10 lg:p-14 sm:rounded-lg md:rounded-none bg-white">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Sign Up</h2>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-6">
              {["Client", "Lawyer", "Judge"].map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-3 mx-2 text-sm font-semibold transition-all duration-300 rounded-full shadow-lg ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                    setState((prevState) => ({
                      ...prevState,
                      role: tab.toLowerCase(),
                      lawyerField: "",
                      judgeField: "",
                    }));
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Form */}
            <div className="mt-8 space-y-6">
              <div className="relative">
                <label
                  htmlFor="fullName"
                  className="ml-3 text-sm font-bold text-gray-700 tracking-wide"
                >
                  Full Name
                </label>
                <input
                  className={`w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500 ${
                    errors.fullName ? "border-red-500" : ""
                  }`}
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  onChange={handleInputChange}
                  value={state.fullName}
                  required
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="email"
                  className="ml-3 text-sm font-bold text-gray-700 tracking-wide"
                >
                  Email
                </label>
                <input
                  className={`w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  id="email"
                  name="email"
                  placeholder="john@example.com"
                  onChange={handleInputChange}
                  value={state.email}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="phoneNumber"
                  className="ml-3 text-sm font-bold text-gray-700 tracking-wide"
                >
                  Phone Number
                </label>
                <input
                  className={`w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500 ${
                    errors.phoneNumber ? "border-red-500" : ""
                  }`}
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="+92 000-000000"
                  onChange={handleInputChange}
                  value={state.phoneNumber}
                  required
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Password Fields */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="ml-3 text-sm font-bold text-gray-700 tracking-wide"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    className={`w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={handleInputChange}
                    value={state.password}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="ml-3 text-sm font-bold text-gray-700 tracking-wide"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    className={`w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    onChange={handleInputChange}
                    value={state.confirmPassword}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
                {errors.passwordMatch && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.passwordMatch}
                  </p>
                )}
              </div>

              {/* Conditional Fields for Tabs */}
              {activeTab === "Lawyer" && (
                <>
                  <div className="relative">
                    <label
                      htmlFor="lawyerField"
                      className="ml-3 text-sm font-bold text-gray-700 tracking-wide"
                    >
                      Lawyer Specialization
                    </label>
                    <input
                      className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
                      id="lawyerField"
                      name="lawyerField"
                      placeholder="E.g., Corporate Law"
                      onChange={handleInputChange}
                      value={state.lawyerField}
                    />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="experience"
                      className="ml-3 text-sm font-bold text-gray-700 tracking-wide"
                    >
                      Lawyer Experience
                    </label>
                    <input
                      className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
                      id="experience"
                      name="experience"
                      placeholder="E.g., Corporate Law"
                      type="number"
                      onChange={handleInputChange}
                      value={state.experience}
                    />
                  </div>
                </>
              )}

              {activeTab === "Judge" && (
                <div className="relative">
                  <label
                    htmlFor="judgeField"
                    className="ml-3 text-sm font-bold text-gray-700 tracking-wide"
                  >
                    Court Name
                  </label>
                  <input
                    className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
                    id="judgeField"
                    name="judgeField"
                    placeholder="E.g., Supreme Court"
                    onChange={handleInputChange}
                    value={state.judgeField}
                  />
                </div>
              )}

              {otpFieldVisible && (
                <div className="relative w-full">
                  <input
                    className="w-full text-base px-4 py-2 pr-16 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
                    id="verifyotp"
                    name="verifyotp"
                    placeholder="Verify OTP"
                    onChange={handleOTPInputChange}
                    value={otpState.otp}
                  />
                  <button
                    className="absolute rounded-2xl  right-2 top-1/2 transform -translate-y-1/2 bg-indigo-500 text-white px-3 py-1 text-sm hover:bg-indigo-600 transition"
                    onClick={handleVerifyOTP}
                  >
                    Verify
                  </button>
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="flex items-center justify-between space-x-2">
                <Checkbox
                  id="terms"
                  onCheckedChange={handleCheckboxChange}
                  className="h-5 w-5 border-gray-400 rounded"
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  By creating an account, you agree to our{" "}
                  <Link href="/" className="underline">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/" className="underline">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              {signupFieldVisible ? (
                <div>
                  <button
                    onClick={handleSubmit}
                    className="w-full flex justify-center bg-gradient-to-r from-indigo-500 to-blue-600 hover:bg-gradient-to-l hover:from-blue-500 hover:to-indigo-600 text-gray-100 p-4 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={handleSendOTP}
                    className="w-full flex justify-center bg-gradient-to-r from-indigo-500 to-blue-600 hover:bg-gradient-to-l hover:from-blue-500 hover:to-indigo-600 text-gray-100 p-4 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                  >
                    Send OTP
                  </button>
                </div>
              )}

              {/* Success/Error Messages */}
              {successMessage && (
                <div className="text-center text-green-500 mt-4">
                  {successMessage}
                </div>
              )}
              {errors.submit && (
                <div className="text-center text-red-500 mt-4">
                  {errors.submit}
                </div>
              )}

              <p className="flex flex-col items-center justify-center mt-10 text-center text-md text-gray-500">
                <span>Back to Login page</span>
                <Link
                  href="/login"
                  className="text-indigo-400 hover:text-blue-500 no-underline hover:underline cursor-pointer transition ease-in duration-300"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
