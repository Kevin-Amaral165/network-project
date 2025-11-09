import { Input } from "../../components/input";

export default function FormPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Intention Form</h1>

        <form className="space-y-4">
          <Input
            id="name"
            name="name"
            type="text"
            label="Name"
            placeholder="Enter your name"
          />

          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
          />

          <Input
            id="phone"
            name="phone"
            type="tel"
            label="Phone"
            placeholder="Enter your phone number"
          />

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
