import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminJudgeTable() {
  const [judges, setJudges] = useState([]); // Store the list of judges

  useEffect(() => {
    axios
      .get(`/api/api/getJudges`)
      .then((response) => {
        setJudges(response.data.data);
      })
      .catch((err) => {
        console.error("Error fetching judges:", err.message);
      });
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-4">Judges Directory</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        {judges.length === 0 ? (
          <p className="text-center py-10">
            No judges available at the moment.
          </p>
        ) : (
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Court
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {judges.map((judge: any) => (
                <tr key={judge.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {judge.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {judge.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {judge.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {judge.judgeField}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
