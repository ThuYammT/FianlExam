"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from 'next/link';  // Import Link for navigation

// Load the base URL from the environment variables
const APIBASE = process.env.NEXT_PUBLIC_API_URL;

export default function CustomerPage() {
  const { register, handleSubmit, reset } = useForm();
  const [customers, setCustomers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState(null);

  // Fetch all customers
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await fetch(`${APIBASE}/api/customer`); // Use APIBASE for the request
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    }

    fetchCustomers();
  }, []);

  // Handle the edit action
  const startEdit = (customer) => () => {
    setEditMode(true);
    setCurrentCustomerId(customer._id);
    reset(customer);  // Pre-fill form with customer details
  };

  // Create or update a customer
  const createOrUpdateCustomer = async (data) => {
    const method = editMode ? "PUT" : "POST";
    const url = `${APIBASE}/api/customer`;  // Use APIBASE for the request

    const payload = editMode
      ? { ...data, _id: currentCustomerId } // Include ID when updating
      : data;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log("API response:", responseData);

      if (response.ok) {
        reset();  // Reset form
        setEditMode(false);
        setCurrentCustomerId(null);
        fetchCustomers();  // Refresh the list of customers
      } else {
        console.error("Failed to create/update customer:", responseData);
      }
    } catch (error) {
      console.error("Error in createOrUpdateCustomer:", error);
    }
  };

  // Delete a customer
  const deleteCustomer = async (id) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      const response = await fetch(`${APIBASE}/api/customer/${id}`, { method: "DELETE" });  // Use APIBASE for the request
      if (response.ok) {
        fetchCustomers();  // Refresh customer list
      } else {
        console.error("Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Manage Customers</h1>

      {/* Form for creating/updating customers */}
      <form onSubmit={handleSubmit(createOrUpdateCustomer)} className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Name</label>
            <input
              {...register("name", { required: true })}
              className="border border-gray-400 p-2 w-full"
              placeholder="Customer Name"
            />
          </div>
          <div>
            <label className="block mb-2">Date of Birth</label>
            <input
              {...register("dateOfBirth", { required: true })}
              className="border border-gray-400 p-2 w-full"
              type="date"
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div>
            <label className="block mb-2">Member Number</label>
            <input
              {...register("memberNumber", { required: true })}
              className="border border-gray-400 p-2 w-full"
              type="number"
              placeholder="Member Number"
            />
          </div>
          <div>
            <label className="block mb-2">Interests</label>
            <input
              {...register("interests")}
              className="border border-gray-400 p-2 w-full"
              placeholder="e.g., movies, football, gym"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className={`${
              editMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            } text-white py-2 px-4 rounded`}
          >
            {editMode ? "Update Customer" : "Add Customer"}
          </button>
          {editMode && (
            <button
              onClick={() => {
                reset();  // Clear form
                setEditMode(false);
                setCurrentCustomerId(null);
              }}
              className="ml-4 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List of customers */}
      <div className="bg-white p-4 shadow-md">
        <h2 className="text-xl mb-4">Customer List</h2>
        {customers.length === 0 ? (
          <p>No customers found</p>
        ) : (
          <ul>
            {customers.map((customer) => (
              <li key={customer._id} className="mb-2">
                <Link href={`/customer/${customer._id}`}>
                  <a className="font-bold text-blue-500 hover:underline">
                    {customer.name} - Member #{customer.memberNumber}
                  </a>
                </Link>
                <button
                  onClick={startEdit(customer)}
                  className="ml-4 bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCustomer(customer._id)}
                  className="ml-2 bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
