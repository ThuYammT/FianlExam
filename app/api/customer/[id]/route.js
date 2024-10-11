import Customer from "@/models/Customer";
import dbConnect from "@/lib/db";

// Get customer by ID
export async function GET(request, { params }) {
  await dbConnect();
  try {
    const customer = await Customer.findById(params.id);
    if (!customer) {
      return new Response("Customer not found", { status: 404 });
    }
    return new Response(JSON.stringify(customer), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(params.id);
    if (!deletedCustomer) {
      return new Response("Customer not found", { status: 404 });
    }
    return new Response(JSON.stringify(deletedCustomer), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
