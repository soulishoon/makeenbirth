import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
 

  return (
    <>
      <style>{`
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .float-animation {
          animation: floatUpDown 4s ease-in-out infinite;
        }
      `}</style>

      <div className="h-screen flex flex-col bg-white pt-4 relative overflow-hidden items-center justify-center">

        {/* container بادکنک + متن */}
        <div className="relative flex flex-row-reverse items-center justify-center w-full h-[64vh] px-4">

          <img
            src="/images/baloon.svg"
            alt="balloon"
            className="relative right-28 float-animation lg:right-[130px] lg:h-full h-auto max-h-[400px]"
          />

          {/* متن */}
          <div className="flex flex-col gap-8 md:gap-14 text-right justify-center absolute pr-4 md:pr-9 w-full lg:right-[530px]">

            <div>
              <p className="text-2xl font-[kalamehmedium] leading-tight lg:text-3xl">
                جشن تولد ۱۴ سالگی
              </p>

              <div className="flex items-center gap-2 mt-2">
                <img src="/images/makeenlogo.png" width={28} height={28} alt="logo" />
                <p className="text-3xl font-bold font-[kalamehmedium] lg:text-4xl">آکادمی مکین</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-gray-500 text-sm font-semibold">
              <div className="flex items-center gap-2">
                <img src="/icons/calendar.svg" width={16} height={16} alt="calendar" />
                <p className="font-[kalamehregular] lg:text-lg">جمعه ۲۸ آذر ۱۴۰۴</p>
              </div>

              <div className="flex items-center gap-2">
                <img src="/icons/clock.svg" width={16} height={16} alt="clock" />
                <p className="font-[kalamehregular] lg:text-lg">ساعت ۱۵</p>
              </div>

              <div className="flex items-center gap-2">
                <img src="/icons/location.svg" width={16} height={16} alt="location" />
                <p className="font-[kalamehregular] lg:text-lg">
                  سالن همایش مرکز نوآوری شریف
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="flex flex-col max-w-[450px] w-full mx-auto space-y-4 lg:mt-auto  px-4 pb-6 z-10">

          {/* دکمه ثبت‌نام → فقط navigate */}
          <button
            onClick={() => navigate("/create/step1")}
            className="bg-[#01144f] text-white text-xl font-[kalamehregular]
             h-[55px] rounded-lg transition-all duration-300 w-full 
             hover:bg-[#012a7a] hover:shadow-lg hover:scale-[1.02]
             active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#01144f] focus:ring-offset-2"
          >
            ثبت‌نام
          </button>

          <button
            onClick={() => navigate("/retrieve")}
            className="bg-white border-2 border-[#01144f] text-[#01144f] text-xl font-[kalamehregular]
            h-[55px] rounded-lg transition-all duration-300 w-full
            hover:bg-gray-50 hover:shadow-md hover:scale-[1.02]
            active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#01144f] focus:ring-offset-2"
          >
            دریافت مجدد کارت
          </button>

        </div>
      </div>
    </>
  );
}
