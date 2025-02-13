import Image from "next/image";
import { Mail, Phone } from "lucide-react";

interface User {
  name: string;
  title: string;
  image: string;
}

const users: User[] = [
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "Cody Fisher",
    title: "Product Directives Officer",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "Esther Howard",
    title: "Forward Response Developer",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "Jenny Wilson",
    title: "Central Security Manager",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "Kristin Watson",
    title: "Lead Implementation Liaison",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "Cameron Williamson",
    title: "Internal Applications Engineer",
    image: "/placeholder.svg?height=400&width=400",
  },
];

function UserCard({ user }: { user: User }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide">
              Admin
            </span>
            <p className="text-gray-500 mt-1">{user.title}</p>
          </div>
          <Image
            className="w-12 h-12 rounded-full"
            src={user.image}
            alt={user.name}
            width={48}
            height={48}
          />
        </div>
        <div className="flex border-t border-gray-200">
          <button className="flex-1 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center">
            <Mail className="w-5 h-5 mr-2" />
            Email
          </button>
          <button className="flex-1 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center border-l border-gray-200">
            <Phone className="w-5 h-5 mr-2" />
            Call
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserProfileGrid() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <UserCard key={user.name} user={user} />
        ))}
      </div>
    </div>
  );
}
