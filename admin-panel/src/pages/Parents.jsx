import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

function Parents() {
  const [parents, setParents] = useState([]);

  const fetchParents = async () => {
    try {
      const res = await axios.get("/api/parents"); // adjust if needed
      setParents(res.data.data || []);
    } catch (err) {
      console.error("Error fetching parents:", err);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Parents</h1>

      {parents.map((p) => (
        <div key={p._id} className="bg-white p-4 rounded shadow mb-3">
          <p className="font-semibold">{p.name}</p>
          <p className="text-sm text-gray-500">{p.phone}</p>
        </div>
      ))}
    </div>
  );
}

export default Parents;