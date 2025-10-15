import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { removeFromCart, updateQuantity, clearCart } from "../cart/CartSlice";
import { checkout } from "../../app/api";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const [toastMessage, setToastMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleQuantityChange = (id: number, newQty: number) => {
    if (newQty < 1) return;
    dispatch(updateQuantity({ id, quantity: newQty }));
  };

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = async () => {
    try {
      const result = await checkout(cartItems);
      if (result.success) {      
        dispatch(clearCart());
        setToastMessage(`Order #${result.order_id} successfully placed!`);
        setTimeout(() => setToastMessage(""), 3000);
        navigate('/'); 
      }
    } catch (error) {
      console.error(error);
      setToastMessage("Failed to place order.");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  const total = cartItems.reduce(
    (sum, ci) => sum + (Number(ci.item.price) || 0) * ci.quantity,
    0
  );

  return (
    <div>
      {/* --- ВСПЛЫВАЮЩЕЕ СООБЩЕНИЕ --- */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#28a745",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            zIndex: 9999,
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            fontSize: "16px",
            fontWeight: "500",
            animation: "fadeInOut 3s ease-in-out",
          }}
        >
          {toastMessage}
        </div>
      )}

      <h2>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((ci) => (
                <tr key={ci.item.id}>
                  <td>{ci.item.name}</td>
                  <td>${Number(ci.item.price).toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      className="form-control bg-white"
                      value={ci.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          ci.item.id,
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                  </td>
                  <td>${(Number(ci.item.price) * ci.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemove(ci.item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <h4>Total: ${total.toFixed(2)}</h4>
            <div>
              <button
                className="btn btn-secondary me-2"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
              <button className="btn btn-success" onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
