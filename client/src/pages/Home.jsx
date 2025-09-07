export default function Home() {
  return (
    <main className="max-w-5xl px-4 py-16 mx-auto">
      <div className="p-12 text-center text-white shadow-2xl rounded-3xl bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
        <h1 className="text-4xl font-extrabold drop-shadow-lg">
          Welcome to NotifyPro
        </h1>
        <p className="max-w-xl mx-auto mt-4 text-lg font-medium drop-shadow-md">
          A tiny demo app with signup, login, and a dashboard for managing notification preferences.
        </p>
        <button
          type="button"
          className="py-4 mt-10 text-xl font-bold text-white transition-transform duration-300 ease-in-out transform rounded-full shadow-lg  px-14 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 shadow-pink-400/50 hover:scale-105 hover:shadow-2xl hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-pink-300 active:scale-95 active:brightness-90"
        >
          Send Notification
        </button>
      </div>
    </main>
  );
}
