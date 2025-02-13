// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Camera, Pencil, Star } from "lucide-react";
// import axios from "axios";

// export default function UserProfile() {
//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file) {
//         const url = URL.createObjectURL(file);
//         setAvatarUrl(url);
//       }

//       const formData = new FormData();
//       formData.append("image", file);

//       const ID = localStorage.getItem("userId");
//       try {
//         await axios.put(`/api/api/updateProfile/${ID}`, formData);
//         console.log("Profile image uploaded successfully");
//       } catch (error) {
//         console.error("Error uploading profile image:", error);
//       }
//     }
//   };

//   const [isEditing, setIsEditing] = useState(false);
//   const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
//   const [userData, setUserData] = useState<any>({
//     fullName: "John Doe",
//     email: "john@example.com",
//     phoneNumber: "+1 (555) 000-0000",
//     password: "xxxxxxxx",
//     userType: "client",
//   });
//   console.log("🚀 rating:", userData.clientFeedback[0]);
//   console.log("🚀 reviews:", userData.clientFeedback);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const ID = localStorage.getItem("userId");
//     axios
//       .get(`/api/api/userProfileImage/${ID}`, {
//         responseType: "arraybuffer",
//       })
//       .then((response) => {
//         const base64String = Buffer.from(response.data, "binary").toString(
//           "base64"
//         );
//         const base64Image = `data:image/png;base64,${base64String}`;
//         setAvatarUrl(base64Image);
//       })
//       .catch((err) => {
//         console.error("Error fetching profile image:", err.message);
//         setAvatarUrl(null);
//       });

//     axios
//       .get(`/api/api/getUserProfile/${ID}`)
//       .then((response) => {
//         setUserData(response.data.data);
//       })
//       .catch((err) => {
//         console.error("Error fetching user profile:", err.message);
//         setError(err.message);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setUserData((prev: any) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     setIsEditing(false);
//     const ID = localStorage.getItem("userId");
//     try {
//       await axios.put(`/api/api/updateProfile/${ID}`, {
//         ...userData,
//         rating: userData.userType === "lawyer" ? userData.rating : undefined,
//       });
//       console.log("Profile updated successfully");
//     } catch (error) {
//       console.error("Error updating profile:", error);
//     }
//   };

//   const renderStars = (rating: number) => {
//     return Array(5)
//       .fill(0)
//       .map((_, i) => (
//         <Star
//           key={i}
//           className={`w-5 h-5 ${
//             i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
//           }`}
//         />
//       ));
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="w-full h-48 bg-gradient-to-r from-gray-800 to-gray-900">
//         <div className="max-w-4xl mx-auto px-4">
//           <div className="relative pt-20">
//             <div className="absolute bottom-0 translate-y-1/2 flex items-center gap-4">
//               <div className="relative">
//                 <Avatar className="w-32 h-32 border-4 border-white">
//                   <AvatarImage src={avatarUrl ?? ""} alt="User Avatar" />
//                   <AvatarFallback className="text-white bg-slate-400">
//                     {userData.fullName
//                       .split(" ")
//                       .map((n: any) => n[0])
//                       .join("")}
//                   </AvatarFallback>
//                 </Avatar>
//                 {isEditing && (
//                   <Label
//                     htmlFor="avatar-upload"
//                     className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90"
//                   >
//                     <Camera className="w-4 h-4" />
//                     <input
//                       id="avatar-upload"
//                       type="file"
//                       // accept="image/*"
//                       className="sr-only"
//                       onChange={handleFileChange}
//                     />
//                   </Label>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <input type="text" />

//       <div className="max-w-4xl mx-auto px-4">
//         <Card>
//           <CardHeader className="flex justify-between items-center">
//             <h2 className="text-2xl font-semibold">Profile Information</h2>
//             {!isEditing && (
//               <Button onClick={() => setIsEditing(true)} variant="outline">
//                 <Pencil className="w-4 h-4 mr-2" />
//                 Edit Profile
//               </Button>
//             )}
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="fullName">Full Name</Label>
//               {isEditing ? (
//                 <Input
//                   id="fullName"
//                   name="fullName"
//                   value={userData.fullName}
//                   onChange={handleInputChange}
//                 />
//               ) : (
//                 <div className="p-2 bg-gray-100 rounded">
//                   {userData.fullName}
//                 </div>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               {isEditing ? (
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={userData.email}
//                   onChange={handleInputChange}
//                 />
//               ) : (
//                 <div className="p-2 bg-gray-100 rounded">{userData.email}</div>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="phoneNumber">Phone Number</Label>
//               {isEditing ? (
//                 <Input
//                   id="phoneNumber"
//                   name="phoneNumber"
//                   type="tel"
//                   value={userData.phoneNumber}
//                   onChange={handleInputChange}
//                 />
//               ) : (
//                 <div className="p-2 bg-gray-100 rounded">
//                   {userData.phoneNumber}
//                 </div>
//               )}
//             </div>

//             {isEditing && (
//               <div className="flex justify-end space-x-2">
//                 <Button variant="outline" onClick={() => setIsEditing(false)}>
//                   Cancel
//                 </Button>
//                 <Button
//                   className="bg-black text-white hover:bg-slate-500"
//                   onClick={handleSave}
//                 >
//                   Save Changes
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//         <Card className="mt-6">
//           <CardContent className="space-y-6">
//             {userData.role === "lawyer" && (
//               <div className="space-y-2">
//                 <Label htmlFor="rating">Rating</Label>
//                 <div className="flex items-center space-x-1">
//                   {renderStars(userData.rating || 0)}
//                   <span className="ml-2">{userData.rating || 0}/5</span>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Pencil, Star } from "lucide-react";
import axios from "axios";

export default function UserProfile() {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);

      const formData = new FormData();
      formData.append("image", file);

      const ID = localStorage.getItem("userId");
      try {
        await axios.put(`/api/api/updateProfile/${ID}`, formData);
        console.log("Profile image uploaded successfully");
      } catch (error) {
        console.error("Error uploading profile image:", error);
      }
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>({
    fullName: "John Doe",
    email: "john@example.com",
    phoneNumber: "+1 (555) 000-0000",
    password: "xxxxxxxx",
    userType: "client",
    clientFeedback: [], // Make sure this is populated with reviews data.
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ID = localStorage.getItem("userId");
    axios
      .get(`/api/api/userProfileImage/${ID}`, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        const base64String = Buffer.from(response.data, "binary").toString(
          "base64"
        );
        const base64Image = `data:image/png;base64,${base64String}`;
        setAvatarUrl(base64Image);
      })
      .catch((err) => {
        console.error("Error fetching profile image:", err.message);
        setAvatarUrl(null);
      });

    axios
      .get(`/api/api/getUserProfile/${ID}`)
      .then((response) => {
        setUserData(response.data.data);
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err.message);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsEditing(false);
    const ID = localStorage.getItem("userId");
    try {
      await axios.put(`/api/api/updateProfile/${ID}`, {
        ...userData,
        rating: userData.userType === "lawyer" ? userData.rating : undefined,
      });
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  const calculateAverageRating = () => {
    if (!userData.clientFeedback || userData.clientFeedback.length === 0) {
      return 0;
    }
    const totalRating = userData.clientFeedback.reduce(
      (sum: number, feedback: any) => sum + feedback.rating,
      0
    );
    return totalRating / userData.clientFeedback.length;
  };

  const totalReviews = userData.clientFeedback?.length || 0;
  const averageRating = calculateAverageRating();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full h-48 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative pt-20">
            <div className="absolute bottom-0 translate-y-1/2 flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white">
                  <AvatarImage src={avatarUrl ?? ""} alt="User Avatar" />
                  <AvatarFallback className="text-white bg-slate-400">
                    {userData.fullName
                      .split(" ")
                      .map((n: any) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90"
                  >
                    <Camera className="w-4 h-4" />
                    <input
                      id="avatar-upload"
                      type="file"
                      // accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </Label>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Profile Information</h2>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Pencil className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              {isEditing ? (
                <Input
                  id="fullName"
                  name="fullName"
                  value={userData.fullName}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="p-2 bg-gray-100 rounded">
                  {userData.fullName}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="p-2 bg-gray-100 rounded">{userData.email}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={userData.phoneNumber}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="p-2 bg-gray-100 rounded">
                  {userData.phoneNumber}
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-black text-white hover:bg-slate-500"
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="mt-6">
          <CardContent className="space-y-6">
            {userData.role === "lawyer" && (
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <div className="flex items-center space-x-1">
                  {renderStars(averageRating)}
                  <span className="ml-2">{averageRating.toFixed(1)}/5</span>
                </div>
                <div className="text-gray-500 mt-2">
                  {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
