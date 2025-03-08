// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex flex-col items-center w-full min-h-screen">
      
//       {/* Navbar */}
//       <div className="flex justify-center items-center w-full h-[10vh] bg-white border-b-2 border-black">
//         <div className="flex justify-between items-center w-full max-w-7xl px-4">
//           <div className="flex items-center space-x-2">
//             <svg
//               className="w-6 h-6"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth="1.5"
//               stroke="black"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
//             </svg>
//             <a href="#" className="text-black text-2xl md:text-3xl font-semibold">SynKro</a>
//           </div>
//           <a href="#" className="text-black text-sm md:text-lg font-semibold border-2 border-black px-3 py-2 rounded-full">
//             Sign In
//           </a>
//         </div>
//       </div>

//       {/* Main Section */}
//       <div className="flex flex-col md:flex-row w-full min-h-[90vh] p-6 md:p-0">
        
//         {/* Left Section - Image & Buttons */}
//         <div className="w-full md:w-1/2 flex flex-col items-center justify-center space-y-6">
//           <div className="w-full flex justify-center">
//             <Image 
//               src="/people.jpg" 
//               alt="group"
//               width={500} 
//               height={500} 
//               className="mix-blend-multiply max-w-full h-auto"
//             />
//           </div>

//           <button className="box w-full md:w-auto text-center py-2 px-6 border-2 border-black rounded-full">
//             Sign in to your account
//           </button>

//           <button className="box w-full md:w-auto text-center py-2 px-6 border-2 border-black rounded-full">
//             Request a new account
//           </button>

//           <p className="text-sm text-black text-center">
//             For creating a new account, an admin will be notified to assist you.
//           </p>
//         </div>

//         {/* Right Section - Text & Gear Image */}
//         <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center p-6 md:p-10 relative">
//           <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black">
//             Welcome to Your <br/>SynKro Community 
//           </h1>
//           <p className="text-lg md:text-xl font-semibold text-black mt-2">
//             SynKro karo yaar!
//           </p>

//           {/* Half-buried Gear Icon */}
//           <div className="absolute bottom-[-50px] md:bottom-[-100px] left-1/2 transform -translate-x-1/2">
//             <Image 
//               src="/cog (1).png" 
//               alt="half"
//               width={500} 
//               height={500} 
//               className="h-[200px] md:h-[250px] object-contain"
//             />
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen overflow-hidden">
      
      {/* Navbar */}
      <div className="flex justify-center items-center w-full h-[10vh] bg-white border-b-2 border-black">
        <div className="flex justify-between items-center w-full max-w-7xl px-4">
          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="black"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <a href="#" className="text-black text-2xl md:text-3xl font-semibold">SynKro</a>
          </div>
          <a href="#" className="text-black text-sm md:text-lg font-semibold border-2 border-black px-3 py-2 rounded-full">
            Sign In
          </a>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-col md:flex-row w-full min-h-[90vh] p-6 md:p-0 relative">
        
        {/* Left Section - Image & Buttons */}
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

          <button className="box w-full md:w-auto text-center py-2 px-6 border-2 border-black rounded-full">
            Sign in to your account
          </button>

          <button className="box w-full md:w-auto text-center py-2 px-6 border-2 border-black rounded-full">
            Request a new account
          </button>

          <p className="text-sm text-black text-center pb-15 lg:pb-28 xl:pb-28 ">
            For creating a new account, an admin will be notified to assist you.
          </p>
        </div>

        {/* Right Section - Text & Gear Image */}
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
            

          {/* Gear Icon Fixed at the Bottom */}
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
