export function KioskHeader() {
  return (
    <div className="w-dvw h-[20dvh] px-8">
      <div className=" py-[3dvh] w-full h-full flex justify-between items-center">
        <div className="w-fit flex items-center h-full gap-8">
          <div className="w-full h-full">
            <img
              src="images/lgu-legazpi.png"
              alt="LGU Legazpi Logo"
              className="w-fit h-full"
            />
          </div>
          <div className="flex flex-col space-y-1 items-center justify-center whitespace-nowrap">
            <h2 className="font-bold text-2xl">Office of the Civil Registry</h2>
            <hr className=" w-full border-[.5px] border-black/40" />
            <h4>City Government of Legazpi</h4>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold uppercase underline">Kiosk</h1>
      </div>
    </div>
  );
}
