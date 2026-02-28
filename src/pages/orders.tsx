import React, { useEffect, useState } from 'react';
import { Table, Badge, Spinner, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { Order } from '../types/types.ts';

const SBL_URL = process.env.REACT_APP_SBL_URL || 'http://localhost:8092';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<Order[]>(`${SBL_URL}/api/orders`);
        setOrders(response.data);
      } catch (err) {
        setError('Failed to load orders. Make sure the SBL service is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatDate = (iso: string) =>
    iso ? new Date(iso).toLocaleString() : '—';

  return (
    <Container fluid className="mt-4">
      <h3 className="mb-4">Supply Orders</h3>

      {loading && (
        <div className="d-flex align-items-center gap-2">
          <Spinner animation="border" size="sm" />
          <span>Loading orders…</span>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && orders.length === 0 && (
        <Alert variant="info">No orders found.</Alert>
      )}

      {!loading && !error && orders.length > 0 && (
        <Table striped bordered hover responsive variant="dark" className="align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th>Item Type</th>
              <th>Vendor ID</th>
              <th>Current Stock</th>
              <th>Min Required</th>
              <th>Qty to Order</th>
              <th>Unit Cost</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => {
              const item = order.inventoryItem;
              const stockOk = item.currentStock >= item.minRequired;
              return (
                <tr key={order.id ?? idx}>
                  <td>{order.id}</td>
                  <td>{item.itemName}</td>
                  <td>
                    <Badge bg="secondary">{item.itemType}</Badge>
                  </td>
                  <td>{item.vendorId}</td>
                  <td>
                    <Badge bg={stockOk ? 'success' : 'danger'}>
                      {item.currentStock}
                    </Badge>
                  </td>
                  <td>{item.minRequired}</td>
                  <td>
                    <strong>{order.numberToOrder}</strong>
                  </td>
                  <td>
                    {item.unitCost !== undefined
                      ? `$${item.unitCost.toFixed(2)}`
                      : '—'}
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Orders;
