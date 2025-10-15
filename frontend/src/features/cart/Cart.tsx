import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { removeFromCart, updateQuantity } from "../cart/CartSlice";

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  const handleQuantityChange = (id: number, newQty: number) => {
    if (newQty < 1) return;
    dispatch(updateQuantity({ id, quantity: newQty }));
  };

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const total = cartItems.reduce(
    (sum, ci) => sum + (Number(ci.item.price) || 0) * ci.quantity,
    0
  );

  return (
    <div>
      <h2>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
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
                    id={`qty-${ci.item.id}`}
                    name={`qty-${ci.item.id}`}
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
                {/* <td>${(Number(ci.item.price)).toFixed(2)}</td>
                <td>${ci.quantity.toFixed(2)}</td> */}
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
      )}

      {cartItems.length > 0 && (
        <h4 className="mt-3">Total: ${total.toFixed(2)}</h4>
      )}
    </div>
  );
};

export default Cart;
