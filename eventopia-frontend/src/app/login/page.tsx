"use client";
import { supabase } from "../../../utils/SupabaseClient";
import { LoginMapComponent } from "../components/MapComponent/loginMap";

const LoginPage = () => {
  const handleLogin = async () => {
    const { user, session, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Error signing in with Google:", error.message);
    } else {
      console.log("User logged in:", user);
      // Redirect or do something after successful login
    }
  };

  return (
    <div className="bg-black w-screen h-screen flex">
      <div className="w-2/5 h-screen bg-[#26262681] flex flex-col items-start justify-center px-12">
        <div className="mb-6">
          <h1 className="text-white text-4xl font-medium">Welcome back</h1>
          <p className="text-gray-400 text-md mt-1">Sign in to your account</p>
        </div>
        <div className="w-full">
          <form className="flex flex-col space-y-4">
            <button
              onClick={handleLogin}
              type="button"
              className="w-full bg-[#a5244d] text-white p-2.5 rounded border border-gray-700 hover:bg-[#df2f676e] flex items-center justify-center space-x-2"
            >
              <span>Continue with Google</span>
            </button>

            <p className="text-sm text-gray-400 text-center">
              Don't have an account?
              <a href="#" className="text-white hover:underline ml-1">
                Sign Up Now
              </a>
            </p>
          </form>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-black">
        <LoginMapComponent />
      </div>
    </div>
  );
};

export default LoginPage;
