import React, { useEffect, useState } from "react";
import { getUserOrders } from "../../app/api";

type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: number;
  amount: number;
  created_at: string;
  items: OrderItem[];
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders(); 
        console.log("Fetched orders:", data);

        const mappedOrders: Order[] = data.map((order: any) => ({
          id: order.id,
          amount: parseFloat(order.amount),
          created_at: order.created_at,
          items: order.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price),
            quantity: item.quantity,
          })),
        }));

        setOrders(mappedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrder = (id: number) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  if (loading) return <p>Loading orders...</p>;
  if (orders.length === 0) return <p>You have no orders yet.</p>;

  return (
    <div>
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ccc",
            marginBottom: "12px",
            padding: "12px",
            borderRadius: "6px",
          }}
        >
          <div
            style={{ cursor: "pointer" }}
            onClick={() => toggleOrder(order.id)}
          >
            <strong>Order #{order.id}</strong> — Total: ${order.amount.toFixed(2)} —{" "}
            {new Date(order.created_at).toLocaleString()}
          </div>

          {expandedOrderId === order.id && (
            <div style={{ marginTop: "10px", paddingLeft: "10px" }}>
              {order.items.map((item) => (
                <div key={item.id} style={{ marginBottom: "6px" }}>
                  <strong>{item.name}</strong> — ${item.price.toFixed(2)} × {item.quantity} = ${(
                    item.price * item.quantity
                  ).toFixed(2)}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Orders;
