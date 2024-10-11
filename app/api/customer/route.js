import Customer from "@/models/Customer";
import dbConnect from "@/lib/db";

export async function GET() {
  await dbConnect();
  try {
    const customers = await Customer.find();
    return new Response(JSON.stringify(customers), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}


export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const newCustomer = new Customer(body);
    await newCustomer.save();
    return new Response(JSON.stringify(newCustomer), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const updatedCustomer = await Customer.findByIdAndUpdate(body._id, body, { new: true });
    if (!updatedCustomer) {
      return new Response("Customer not found", { status: 404 });
    }
    return new Response(JSON.stringify(updatedCustomer), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
