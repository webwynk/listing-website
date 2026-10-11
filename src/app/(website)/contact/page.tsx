"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Send,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Wedding Booking Inquiry",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to submit your message.");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Wedding Booking Inquiry",
        message: "",
      });
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated Support</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
            Connect With Our Concierge
          </h1>
          <p className="text-sm sm:text-base text-neutral-400">
            Have questions about booking an artist, coordinating a destination wedding glam squad, or partnering with GlamBook? We&apos;re here to assist.
          </p>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Contact Info (col-span-5) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-3xl bg-neutral-900/60 border border-neutral-800/80 p-8 space-y-6 shadow-xl">
              <h2 className="font-serif text-2xl font-bold text-white">
                GlamBook Headquarters
              </h2>

              <div className="space-y-5 text-sm text-neutral-300">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      Executive Office
                    </span>
                    <span className="font-medium text-white block">
                      GlamBook Technologies Pvt. Ltd.
                    </span>
                    <span className="text-neutral-400 text-xs block">
                      Level 4, High Street Avenue, Bandra West, Mumbai, Maharashtra 400050
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      Direct Email Inquiries
                    </span>
                    <a
                      href="mailto:concierge@glambook.in"
                      className="font-medium text-white hover:text-amber-300 transition block"
                    >
                      concierge@glambook.in
                    </a>
                    <span className="text-neutral-400 text-xs block">
                      Artist Partnerships: partners@glambook.in
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      Concierge Hotline
                    </span>
                    <span className="font-medium text-white block">
                      +91 98765 43210
                    </span>
                    <span className="text-neutral-400 text-xs block">
                      Mon - Sat, 10:00 AM - 7:00 PM IST
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      Response Time Commitment
                    </span>
                    <span className="font-medium text-white block">
                      Within 24 Business Hours
                    </span>
                    <span className="text-neutral-400 text-xs block">
                      Urgent bridal ceremony inquiries flagged priority
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Assurance Pill */}
            <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Your inquiry information is strictly protected by our <strong>Lead Privacy Guarantee</strong>. We never share or sell contact details.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form (col-span-7) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-neutral-900/80 border border-neutral-800/90 p-8 sm:p-10 shadow-2xl">
              <h2 className="font-serif text-2xl font-bold text-white mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs text-neutral-400 mb-6">
                Fill out the form below and our dedicated bridal concierge team will reach out promptly.
              </p>

              {success ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-white">
                    Message Sent Successfully
                  </h4>
                  <p className="text-xs text-neutral-300 max-w-sm mx-auto">
                    Thank you for reaching out to GlamBook. A concierge specialist has received your inquiry and will be in touch within 24 hours.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-2 px-5 py-2 rounded-xl bg-neutral-800 text-white text-xs font-semibold hover:bg-neutral-700 transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Natasha Roy"
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-xs focus:outline-none focus:border-amber-500/60 min-h-[44px]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. natasha@example.com"
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-xs focus:outline-none focus:border-amber-500/60 min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-xs focus:outline-none focus:border-amber-500/60 min-h-[44px]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Inquiry Topic *
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-base md:text-xs font-medium focus:outline-none focus:border-amber-500/60 min-h-[44px] cursor-pointer"
                      >
                        <option value="Wedding Booking Inquiry">Wedding Booking Inquiry</option>
                        <option value="Destination Wedding Squad">Destination Wedding Squad</option>
                        <option value="Artist Registration & Vetting">Artist Registration &amp; Vetting</option>
                        <option value="Editorial & Press Inquiries">Editorial &amp; Press Inquiries</option>
                        <option value="General Support">General Support</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share event dates, destination location, and any specific styling requirements..."
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-xs focus:outline-none focus:border-amber-500/60 resize-none min-h-[120px]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition min-h-[48px] flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Message to Concierge</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
