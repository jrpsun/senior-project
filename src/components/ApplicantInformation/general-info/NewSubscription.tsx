"use client";

import { useState } from "react";
import CheckboxDropdown from "../../common/checkbox";

const SubscriptionForm: React.FC = () => {
  const [onlineSources, setOnlineSources] = useState<string[]>([]);
  const [offlineSources, setOfflineSources] = useState<string[]>([]);

  const onlineOptions = [
    { value: "website", label: "เว็บไซต์ (ICT : www.ict.mahidol.ac.th, Mahidol : www.mahidol.ac.th)" },
    { value: "facebook", label: "Facebook (Faculty of ICT, Mahidol University/ MUICT Open House / TCASMahidol)" },
    { value: "line", label: "Line Official Account (@ictmahidol)" },
    { value: "twitter", label: "X(Twitter)" },
    { value: "instagram", label: "Instagram (ICT Mahidol)" },
    { value: "youtube", label: "Youtube (MUICT Connect)" },
    { value: "other", label: "อื่นๆ" },
  ];

  const offlineOptions = [
    { value: "roadshow", label: "Roadshow" },
    { value: "teacher", label: "ครูแนะนำ" },
    { value: "guardian", label: "ผู้ปกครอง" },
    { value: "friend", label: "เพื่อน" },
    { value: "dekd_tcas", label: "งาน Dek-D TCAS" },
    { value: "mu_open_house", label: "งาน MU Open House" },
    { value: "other", label: "อื่นๆ" },
  ];

  return (
    <div className="flex justify-center py-10 bg-[white] ">
    <div className="bg-white shadow-lg rounded-lg w-full max-w-xl lg:max-w-screen-xl p-6">
    <div className="p-8 bg-white rounded-lg w-full max-w-5xl mx-auto">
      <h2 className="text-2xl text-[#008A90] font-semibold">คุณทราบข่าวการรับสมัครจากช่องทางใด</h2>

      {/* ช่องทางออนไลน์ */}
      <CheckboxDropdown
        label="ช่องทางออนไลน์ (Online)"
        options={onlineOptions}
        selected={onlineSources}
        onChange={setOnlineSources}
      />

      {/* ช่องทางออฟไลน์ */}
      <CheckboxDropdown
        label="ช่องทางออฟไลน์ (Offline)"
        options={offlineOptions}
        selected={offlineSources}
        onChange={setOfflineSources}
      />
    </div>
    </div>
    </div>
  );
};

export default SubscriptionForm;
