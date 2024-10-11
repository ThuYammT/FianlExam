"use client";  // Add this line to ensure it's treated as a Client Component

import { useEffect, useState } from 'react';

const APIBASE = process.env.NEXT_PUBLIC_API_URL;

export default function CustomerDetailPage({ params }) {
  const [customer, setCustomer] = useState(null);
  const { id } = params;

  // Fetch customer details by ID
  useEffect(() => {
    async function fetchCustomerDetails() {
      try {
        const response = await fetch(`${APIBASE}/api/customer/${id}`);
        if (!response.ok) {
          throw new Error(`Error fetching customer: ${response.status}`);
        }
        const data = await response.json();
        setCustomer(data);
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    }

    fetchCustomerDetails();
  }, [id]);

  if (!customer) {
    return <div>Loading customer details...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Customer Details</h1>
      <div className="bg-white p-4 shadow-md">
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Date of Birth:</strong> {new Date(customer.dateOfBirth).toLocaleDateString()}</p>
        <p><strong>Member Number:</strong> {customer.memberNumber}</p>
        <p><strong>Interests:</strong> {customer.interests}</p>
      </div>
    </div>
  );
}
