import React from "react";

const WarnningMessage = () => {
  return (
    <div>
      <p className="text-center text-red-700 font-semibold p-3 text-sm relative z-50">
        <span className="font-bold">تحذير:</span> منتجات الفيب تحتوي على{" "}
        <span className="">النيكوتين</span>، وهو مادة تسبب{" "}
        <span className="font-bold">الإدمان</span> يُنصح باستخدامها من قبل{" "}
        <span className="">البالغين فقط (+21)</span>
      </p>
    </div>
  );
};

export default WarnningMessage;
