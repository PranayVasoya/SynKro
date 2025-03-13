import Image from "next/image";
import Link from 'next/link';
import Navbar from "@components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen overflow-hidden">
      <Navbar />
      {/* Main Section */}
      <div className="flex flex-col md:flex-row w-full min-h-[90vh] p-6 md:p-0 relative ">
        
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center space-y-6">
          <div className="w-full flex justify-center">
            <Image 
              src="/people.jpg" 
              alt="group"
              width={500} 
              height={500} 
              className="mix-blend-multiply max-w-full h-auto"
            />
          </div>
          <Link href="/signin">
            <button className="box w-full md:w-auto text-center py-2 px-6 border-2 border-black rounded-full">
              Sign in to your account
            </button>
          </Link>
          
          <Link href="/signup">
            <button className="box w-full md:w-auto text-center py-2 px-6 border-2 border-black rounded-full">
              Request a new account
            </button>
          </Link>

          <p className="text-sm text-black text-center pb-15 lg:pb-28 xl:pb-28 ">
            For creating a new account, an admin will be notified to assist you.
          </p>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center p-6 md:p-4 relative ">
          <div className=" w-full">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black">
            Welcome to Your <br/>SynKro Community 
          </h1>
          <br />
          <p className="text-lg md:text-xl font-semibold text-black mt-2 pb-20">
            SynKro karo yaar!
          </p>
          </div>
            

          {/* Gear Icon */}
          <div className="flex justify-center items-center w-full">
          <div className="absolute sm:bottom-[-100px] md:bottom-[-180px] lg:bottom-[-230px] bottom-[-90px]  left-1/2 transform -translate-x-1/2 
            max-[425px]:bottom-[-100px] max-[375px]:bottom-[-150px]">
            <Image 
              src="/gear.png" 
              alt="gear"
              width={200} 
              height={200} 
              className="sm:w-[400px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]  object-contain"
            />
          </div>
          </div>
        </div>

      </div>
    </div>
  );
}
