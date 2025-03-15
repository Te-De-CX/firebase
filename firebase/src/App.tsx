import React from "react";
import Auth from "./components/Auth";
import { db } from "./config/firebase";
import { getDocs, collection } from "firebase/firestore";

const App: React.FC = () => {
  const [lists, setList] = React.useState<{ id: string; name: string; image: string }[]>([]);

  const listCollections = collection(db, "items");

  React.useEffect(() => {
    const getList = async () => {
      try {
        const data = await getDocs(listCollections);
        const filterData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setList(filterData);
      } catch (err) {
        console.error(err);
      }
    };
    getList();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Auth Component */}
        <div className="mb-8">
          <Auth />
        </div>

        {/* List of Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {lists.map((list) => (
            <div
              key={list.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <img
                src={list.image}
                alt={list.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h1 className="text-xl font-semibold text-gray-800">
                  {list.name}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;