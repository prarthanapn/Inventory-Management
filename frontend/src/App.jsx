import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:5000/products';

function App() {
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', quantity: '' });
  const [editId, setEditId] = useState(null);
  const [restockQty, setRestockQty] = useState({});
  const [purchaseQty, setPurchaseQty] = useState({});

  const fetchProducts = async () => {
    const res = await axios.get(API_URL);
    setProducts(res.data);
  };

  const fetchLowStock = async () => {
    const res = await axios.get(`${API_URL}/low-stock`);
    setLowStock(res.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchLowStock();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${API_URL}/${editId}`, form);
    } else {
      await axios.post(API_URL, form);
    }
    setForm({ name: '', description: '', price: '', quantity: '' });
    setEditId(null);
    fetchProducts();
    fetchLowStock();
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      quantity: p.quantity,
    });
    setEditId(p.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchProducts();
    fetchLowStock();
  };

  const handleRestock = async (id) => {
    const qty = restockQty[id];
    if (!qty || qty < 1) return;
    await axios.put(`${API_URL}/restock/${id}`, { quantity: qty });
    setRestockQty(prev => ({ ...prev, [id]: '' }));
    fetchProducts();
    fetchLowStock();
  };

  const handlePurchase = async (id) => {
    const qty = purchaseQty[id];
    if (!qty || qty < 1) return;
    await axios.post(`${API_URL}/purchase/${id}`, { quantity: qty });
    setPurchaseQty(prev => ({ ...prev, [id]: '' }));
    fetchProducts();
    fetchLowStock();
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Inventory Management</h2>

      <form className="card p-3 mb-4 mx-auto" style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>
        <input className="form-control mb-2" type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input className="form-control mb-2" type="text" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
        <input className="form-control mb-2" type="number" placeholder="Price" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
        <input className="form-control mb-2" type="number" placeholder="Quantity" min="0" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
        <button className="btn btn-primary w-100" type="submit">{editId ? 'Update' : 'Create'} Product</button>
      </form>

      <div className="row">
        {products.map(p => (
          <div key={p.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description}</p>
                <p className="card-text"><strong>Price:</strong> ${p.price}</p>
                <p className="card-text"><strong>Qty:</strong> {p.quantity}</p>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(p)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                <hr />
                <div className="mb-2 d-flex">
                  <input type="number" className="form-control me-2" placeholder="Restock" min="1"
                    value={restockQty[p.id] || ''} onChange={e => setRestockQty({ ...restockQty, [p.id]: e.target.value })} />
                  <button className="btn btn-outline-success btn-sm" onClick={() => handleRestock(p.id)}>Restock</button>
                </div>
                <div className="d-flex">
                  <input type="number" className="form-control me-2" placeholder="Purchase" min="1"
                    value={purchaseQty[p.id] || ''} onChange={e => setPurchaseQty({ ...purchaseQty, [p.id]: e.target.value })} />
                  <button className="btn btn-outline-primary btn-sm" onClick={() => handlePurchase(p.id)}>Purchase</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h4 className="mt-5">Low Stock Alerts</h4>
      {lowStock.length === 0 ? (
        <div className="alert alert-success mt-2">All products sufficiently stocked.</div>
      ) : (
        <ul className="list-group mt-2">
          {lowStock.map(p => (
            <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
              {p.name}
              <span className="badge bg-danger rounded-pill">{p.quantity}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
