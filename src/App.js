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

<div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
  <div style={{ flex: 1 }}>
    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Company Name</label>
    <input
      name="businessName"
     
      onChange={(e) => handleChange(setBusiness, 'name', e.target.value)}
    />
  </div>
  <div style={{ flex: 1 }}>
    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Address</label>
    <input
      name="businessAddress"
    
      onChange={(e) => handleChange(setBusiness, 'address', e.target.value)}
    />
  </div>
</div>

<div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
  <div style={{ flex: 1 }}>
    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Email</label>
    <input
      name="businessEmail"
     
      onChange={(e) => handleChange(setBusiness, 'email', e.target.value)}
    />
  </div>
  <div style={{ flex: 1 }}>
    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Phone</label>
    <input
      name="businessPhone"
    
      onChange={(e) => handleChange(setBusiness, 'phone', e.target.value)}
    />
  </div>
</div>


<h2>Client Info</h2>

<div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
  <div style={{ flex: 1 }}>
    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Client Name</label>
    <input name="clientName" onChange={(e) => handleChange(setClient, 'name', e.target.value)} />
  </div>
  <div style={{ flex: 1 }}>
    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Client Address</label>
    <input name="clientAddress"  onChange={(e) => handleChange(setClient, 'address', e.target.value)} />
  </div>
</div>

<div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
  <div style={{ flex: 1 }}>
    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Client Email</label>
    <input name="clientEmail"  onChange={(e) => handleChange(setClient, 'email', e.target.value)} />
  </div>
  <div style={{ flex: 1 }}>
    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Client Phone</label>
    <input name="clientPhone"  onChange={(e) => handleChange(setClient, 'phone', e.target.value)} />
  </div>
</div>

<h2>Invoice Info</h2>

<div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
  <div style={{ flex: 1 }}>
    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Invoice Number</label>
    <input name="invoiceNumber"  onChange={(e) => handleChange(setInvoiceInfo, 'number', e.target.value)} />
  </div>
  <div style={{ flex: 1 }}>
    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Invoice Date</label>
    <input type="date" name="invoiceDate" onChange={(e) => handleChange(setInvoiceInfo, 'date', e.target.value)} />
  </div>
</div>

<div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
  <div style={{ flex: 1 }}>
    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Due Date</label>
    <input type="date" name="dueDate" onChange={(e) => handleChange(setInvoiceInfo, 'dueDate', e.target.value)} />
  </div>
  <div style={{ flex: 1 }}>
    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Payment Terms</label>
    <input name="terms" placeholder="UPI/NET-PAY/CARD" onChange={(e) => handleChange(setInvoiceInfo, 'terms', e.target.value)} />
  </div>
</div>

<div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
  <div style={{ flex: 1 }}>
    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>PO Number</label>
    <input name="poNumber" placeholder="EX 12345..." onChange={(e) => handleChange(setInvoiceInfo, 'poNumber', e.target.value)} />
  </div>
</div>


      <h2>Invoice Items</h2>
      {items.map((item, i) => (
  <div key={i} style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      <div style={{ flex: 1 }}>
        <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Product Name</label>
        <input
          name={`productName-${i}`}
         
          value={item.productName}
          onChange={(e) => handleItemChange(i, 'productName', e.target.value)}
        />
      </div>
      <div style={{ flex: 1 }}>
        <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Quantity</label>
        <input
          name={`qty-${i}`}
          placeholder="Quantity"
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={item.qty}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleItemChange(i, 'qty', value);
            }
          }}
        />
      </div>
    </div>

    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      <div style={{ flex: 1 }}>
        <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Price (₹)</label>
        <input
          name={`price-${i}`}
          placeholder="Price (₹)"
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={item.price}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleItemChange(i, 'price', value);
            }
          }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Discount (%)</label>
        <input
          name={`discount-${i}`}
          placeholder="Discount (%)"
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={item.discount}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleItemChange(i, 'discount', value);
            }
          }}
        />
      </div>
    </div>

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
