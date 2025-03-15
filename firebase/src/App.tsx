import React from "react";
import Auth from "./components/Auth";
import { db,auth } from "./config/firebase";
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

const App: React.FC = () => {
  const [lists, setList] = React.useState<{ id: string; name: string; image: string; numberAvailable: number; availability: boolean }[]>([]);
  const [newName, setName] = React.useState("");
  const [newImage, setImage] = React.useState("");
  const [numberAvailable, setNumber] = React.useState<number | string>("");
  const [availability, setIsAvailable] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | null>(null); // Track which item is being edited
  const [editedName, setEditedName] = React.useState(""); // Store the edited name

  const listCollections = collection(db, "items");

  React.useEffect(() => {
    const getList = async () => {
      try {
        const data = await getDocs(listCollections);
        const filterData = data.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          image: doc.data().image,
          numberAvailable: doc.data().numberAvailable,
          availability: doc.data().availability,
        }));
        setList(filterData);
      } catch (err) {
        console.error(err);
      }
    };
    getList();
  }, []);

  const AddToList = async () => {
    if (!newName || !newImage || !numberAvailable) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await addDoc(listCollections, {
        name: newName,
        image: newImage,
        numberAvailable: Number(numberAvailable),
        availability,
        userId: auth?.currentUser?.uid
      });

      // Clear input fields
      setName("");
      setImage("");
      setNumber("");
      setIsAvailable(true);

      // Refresh the list
      const data = await getDocs(listCollections);
      const filterData = data.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        image: doc.data().image,
        numberAvailable: doc.data().numberAvailable,
        availability: doc.data().availability,
      }));
      setList(filterData);

      alert("Item added successfully!");
    } catch (err) {
      console.error("Error adding item: ", err);
      alert("Error adding item.");
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const itemDoc = doc(db, "items", id); // Reference the document to delete
      await deleteDoc(itemDoc); // Delete the document

      // Refresh the list
      const data = await getDocs(listCollections);
      const filterData = data.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        image: doc.data().image,
        numberAvailable: doc.data().numberAvailable,
        availability: doc.data().availability,
      }));
      setList(filterData);

      alert("Item deleted successfully!");
    } catch (err) {
      console.error("Error deleting item: ", err);
      alert("Error deleting item.");
    }
  };

  const startEditing = (id: string, name: string) => {
    setEditingId(id); // Set the item being edited
    setEditedName(name); // Set the current name for editing
  };

  const saveEdit = async (id: string) => {
    if (!editedName.trim()) {
      alert("Name cannot be empty.");
      return;
    }

    try {
      const itemDoc = doc(db, "items", id); // Reference the document to update
      await updateDoc(itemDoc, { name: editedName }); // Update the name

      // Refresh the list
      const data = await getDocs(listCollections);
      const filterData = data.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        image: doc.data().image,
        numberAvailable: doc.data().numberAvailable,
        availability: doc.data().availability,
      }));
      setList(filterData);

      setEditingId(null); // Exit edit mode
      alert("Item updated successfully!");
    } catch (err) {
      console.error("Error updating item: ", err);
      alert("Error updating item.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Auth Component */}
        <div className="mb-8">
          <Auth />
        </div>

        {/* Add Item Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={newName}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newImage}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Number Available"
              value={numberAvailable}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={availability}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-5 h-5 mr-2"
              />
              <label className="text-gray-700">Available</label>
            </div>
            <button
              onClick={AddToList}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Add to List
            </button>
          </div>
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
                {editingId === list.id ? (
                  // Edit mode
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => saveEdit(list.id)}
                      className="w-full bg-green-500 text-white py-1 px-2 rounded-lg hover:bg-green-600 transition duration-200"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  // Display mode
                  <>
                    <h1 className="text-xl font-semibold text-gray-800">
                      {list.name}
                    </h1>
                    <p className="text-gray-600">
                      Available: {list.numberAvailable}
                    </p>
                    <p className="text-gray-600">
                      Status: {list.availability ? "Available" : "Unavailable"}
                    </p>
                    <button
                      onClick={() => startEditing(list.id, list.name)}
                      className="w-full mt-2 bg-yellow-500 text-white py-1 px-2 rounded-lg hover:bg-yellow-600 transition duration-200"
                    >
                      Edit
                    </button>
                  </>
                )}
                <button
                  onClick={() => deleteItem(list.id)}
                  className="w-full mt-2 bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;