import React from 'react';

export default function ConsultationDetails({ serviceDetails }) {
  return (
    <div className="space-y-8 pr-0 md:pr-4">
      {/* Brand Title Frame */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#a38c77] font-semibold block mb-2">
          {serviceDetails.type || "Private Advisory Session"}
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-[#634032] font-light leading-tight">
          {serviceDetails.title}
        </h2>
        <div className="w-12 h-[1px] bg-[#bfa791]/30 mt-4"></div>
      </div>

      {/* Overview Block */}
      <div className="space-y-4 text-xs font-light text-[#634032]/80 leading-relaxed">
        <p className="font-serif italic text-sm text-[#a38c77]">
          Expert guidance. Practical strategies. Real results.
        </p>
        <p>
          This 1:1 consultation is designed to help you navigate your child's behavior with practical, 
          developmentally appropriate strategies. You'll leave with clear tools you can start using immediately.
        </p>
      </div>

      {/* Target Audiences */}
      <div className="space-y-2">
        <h4 className="text-[10px] uppercase tracking-widest text-[#a38c77] font-bold">Who This Is For</h4>
        <ul className="text-xs font-light text-[#634032]/80 space-y-1.5 list-disc list-inside">
          <li>Parents of children aged 0–7 years</li>
          <li>You are dealing with tantrums, stubbornness, or communication struggles</li>
          <li>You've tried different approaches but nothing seems to work</li>
          <li>You want structured, realistic guidance, not guesswork...</li>
        </ul>
      </div>

      {/* Core Outcomes Cabinet */}
      <div className="bg-[#efe9e4]/30 p-5 rounded-xs border border-[#bfa791]/15 space-y-3">
        <h4 className="text-[10px] uppercase tracking-widest text-[#634032] font-bold">What You'll Gain</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-light text-[#634032]/90">
          <p>• Stronger connection with your child</p>
          <p>• More peace, less stress at home</p>
          <p>• Confidence in parenting choices</p>
          <p>• Practical strategies that actually work</p>
        </div>
      </div>

      {/* Pre-Session Onboarding Instructions */}
      <div className="space-y-3 text-xs font-light text-[#634032]/80">
        <h4 className="text-[10px] uppercase tracking-widest text-[#a38c77] font-bold">Pre-Session Guide 🤎</h4>
        <div className="space-y-2 bg-white border border-gray-100 p-4 rounded-xs">
          <p className="font-medium text-[#634032]">How to prepare:</p>
          <p className="pl-2">• Think about 2–3 real situations with your child.</p>
          <p className="pl-2">• Be ready to describe what happens before, during and after.</p>
          <p className="pl-2">• Note down what you have already tried so far.</p>
        </div>
      </div>
    </div>
  );
}