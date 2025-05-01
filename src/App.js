import React, { useState } from 'react';
import jsPDF from 'jspdf';
import './App.css';

function App() {
  const [business, setBusiness] = useState({ name: '', address: '', email: '', phone: '' });
  const [client, setClient] = useState({ name: '', address: '', email: '', phone: '' });
  const [invoiceInfo, setInvoiceInfo] = useState({ number: '', date: '', dueDate: '', terms: '', poNumber: '' });
  const [items, setItems] = useState([{ productName: '', qty: 1, price: 0, discount: 0 }]);

  const handleChange = (setFunc, field, value) => {
    setFunc(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    setItems([...items, { productName: '', qty: 1, price: 0, discount: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === 'qty' || field === 'price' || field === 'discount' ? Number(value) : value;
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const totalDiscount = items.reduce((sum, item) => sum + ((item.qty * item.price) * (item.discount / 100)), 0);
  const total = subtotal - totalDiscount;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Invoice #: ${invoiceInfo.number}`, 10, 10);
    doc.text(`Date: ${invoiceInfo.date}`, 10, 20);
    doc.text(`Due Date: ${invoiceInfo.dueDate}`, 10, 30);
    doc.text(`PO Number: ${invoiceInfo.poNumber}`, 10, 40);
    doc.text(`Payment Terms: ${invoiceInfo.terms}`, 10, 50);

    doc.text(`From: ${business.name}`, 10, 60);
    doc.text(`${business.address}`, 10, 70);
    doc.text(`Email: ${business.email}`, 10, 80);
    doc.text(`Phone: ${business.phone}`, 10, 90);

    doc.text(`To: ${client.name}`, 110, 60);
    doc.text(`${client.address}`, 110, 70);
    doc.text(`Email: ${client.email}`, 110, 80);
    doc.text(`Phone: ${client.phone}`, 110, 90);

    items.forEach((item, index) => {
      const y = 110 + index * 10;
      doc.text(`${index + 1}. ${item.productName} - ${item.qty} × ₹${item.price} (-${item.discount}%)`, 10, y);
    });
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 10, 120 + items.length * 10);
    doc.text(`Discount: ₹${totalDiscount.toFixed(2)}`, 10, 130 + items.length * 10);
    doc.text(`Total: ₹${total.toFixed(2)}`, 10, 140 + items.length * 10);
    doc.save('invoice.pdf');
  };

  return (
    <div className="container">
      <h1>Invoice Generator</h1>

      <h2>Business Info</h2>
      <input name="businessName" placeholder="Your Company Name" onChange={(e) => handleChange(setBusiness, 'name', e.target.value)} />
      <input name="businessAddress" placeholder="Your Address" onChange={(e) => handleChange(setBusiness, 'address', e.target.value)} />
      <input name="businessEmail" placeholder="Your Email" onChange={(e) => handleChange(setBusiness, 'email', e.target.value)} />
      <input name="businessPhone" placeholder="Your Phone" onChange={(e) => handleChange(setBusiness, 'phone', e.target.value)} />

      <h2>Client Info</h2>
      <input name="clientName" placeholder="Client Name" onChange={(e) => handleChange(setClient, 'name', e.target.value)} />
      <input name="clientAddress" placeholder="Client Address" onChange={(e) => handleChange(setClient, 'address', e.target.value)} />
      <input name="clientEmail" placeholder="Client Email" onChange={(e) => handleChange(setClient, 'email', e.target.value)} />
      <input name="clientPhone" placeholder="Client Phone" onChange={(e) => handleChange(setClient, 'phone', e.target.value)} />

      <h2>Invoice Info</h2>
      <input name="invoiceNumber" placeholder="Invoice Number" onChange={(e) => handleChange(setInvoiceInfo, 'number', e.target.value)} />
      <input name="invoiceDate" placeholder="Invoice Date" type="date" onChange={(e) => handleChange(setInvoiceInfo, 'date', e.target.value)} />
      <input name="dueDate" placeholder="Due Date" type="date" onChange={(e) => handleChange(setInvoiceInfo, 'dueDate', e.target.value)} />
      <input name="terms" placeholder="Payment Terms" onChange={(e) => handleChange(setInvoiceInfo, 'terms', e.target.value)} />
      <input name="poNumber" placeholder="PO Number" onChange={(e) => handleChange(setInvoiceInfo, 'poNumber', e.target.value)} />

      <h2>Invoice Items</h2>
      {items.map((item, i) => (
        <div key={i} className="item-row">
          <input name={`productName-${i}`} placeholder="Product Name" value={item.productName} onChange={(e) => handleItemChange(i, 'productName', e.target.value)} />
          <input name={`qty-${i}`} placeholder="Quantity" type="number" value={item.qty} onChange={(e) => handleItemChange(i, 'qty', e.target.value)} />
          <input name={`price-${i}`} placeholder="Price (₹)" type="number" value={item.price} onChange={(e) => handleItemChange(i, 'price', e.target.value)} />
          <input name={`discount-${i}`} placeholder="Discount (%)" type="number" value={item.discount} onChange={(e) => handleItemChange(i, 'discount', e.target.value)} />
          <button onClick={() => removeItem(i)}>Remove</button>
        </div>
      ))}
      <button onClick={addItem}>Add Item</button>

      <h3>Subtotal: ₹{subtotal.toFixed(2)}</h3>
      <h3>Discount: ₹{totalDiscount.toFixed(2)}</h3>
      <h2>Total: ₹{total.toFixed(2)}</h2>

      <button onClick={generatePDF}>Download Invoice</button>
    </div>
  );
}

export default App;
