import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setItems, setSearchTerm } from "./ItemsSlice";
import type { RootState, AppDispatch } from "../../app/store";
import { getItems } from "../../app/api";
import { addToCart } from "../cart/CartSlice";

const ItemsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.items.items);
  const searchTerm = useSelector((state: RootState) => state.items.searchTerm);

  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [toastMessage, setToastMessage] = useState<string>("");

  // Фетчим продукты с API
  useEffect(() => {
    const fetchItems = async () => {
    const data = await getItems();
    let itemsArray: any[] = [];

    if (Array.isArray(data)) {
        itemsArray = data;
    } else if (Array.isArray(data.items)) {
        itemsArray = data.items;
    }

    // Преобразуем price в число
    const normalizedItems = itemsArray.map((item) => ({
        ...item,
        price: Number(item.price),
    }));

    dispatch(setItems(normalizedItems));
    };

    fetchItems();
  }, [dispatch]);

  const handleAddToCart = (itemId: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const quantity = quantities[itemId] || 1;
    dispatch(addToCart({ item, quantity }));

    setToastMessage(`"${item.name}" added to cart`);
    setTimeout(() => setToastMessage(""), 3000); 
  };

  const handleQuantityChange = (itemId: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [itemId]: value }));
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Всплывающее уведомление сверху */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#28a745",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 9999,
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          {toastMessage}
        </div>
      )}

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
      />

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Add</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>${item.price}</td>
              <td>
                <input
                  type="number"
                  min={1}
                  className="form-control"
                  value={quantities[item.id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                  }
                />
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddToCart(item.id)}
                >
                  Add to Cart
                </button>
              </td>
            </tr>
          ))}
          {filteredItems.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ItemsList;
