"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Settings,
  Shield,
  Globe,
  Save,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Image as ImageIcon,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "security" | "social_seo">("general");
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      if (json.success && json.data.settings) {
        setSettings(json.data.settings);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: prev[key] === "true" ? "false" : "true",
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatusMessage(null);

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update platform settings.");
      }

      setStatusMessage({
        type: "success",
        text: "Platform configuration settings updated successfully!",
      });
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to update platform settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1e1a19] tracking-tight">
            Platform Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure core platform identity, lead privacy rules, and SEO defaults
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchSettings()}
            className="rounded-xl h-11 border-border text-[#1e1a19] hover:bg-neutral-100"
          >
            <RotateCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {[
          { id: "general", label: "General & Branding", icon: Settings },
          { id: "security", label: "Lead Privacy & Security", icon: Shield },
          { id: "social_seo", label: "SEO & Social Links", icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as any);
                setStatusMessage(null);
              }}
              className={`px-4 py-2.5 text-xs md:text-sm font-medium rounded-xl transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-[#eb7583] text-white shadow-xs font-semibold"
                  : "bg-white text-muted-foreground hover:text-[#1e1a19] hover:bg-neutral-100 border border-border/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Notification Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 border ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span className="font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* Settings Form */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-border p-8 animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 rounded-sm w-1/4"></div>
          <div className="h-10 bg-neutral-100 rounded-xl"></div>
          <div className="h-10 bg-neutral-100 rounded-xl"></div>
          <div className="h-10 bg-neutral-100 rounded-xl"></div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* General Tab */}
          {activeTab === "general" && (
            <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-5">
              <h3 className="font-serif font-bold text-lg text-[#1e1a19]">
                General Platform Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                    Platform Name
                  </label>
                  <Input
                    type="text"
                    value={settings.site_name || ""}
                    onChange={(e) => handleChange("site_name", e.target.value)}
                    placeholder="GlamBook"
                    className="text-base md:text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                    Platform Tagline
                  </label>
                  <Input
                    type="text"
                    value={settings.site_tagline || ""}
                    onChange={(e) => handleChange("site_tagline", e.target.value)}
                    placeholder="Find and book top makeup artists & photographers"
                    className="text-base md:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                    Support Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={settings.contact_email || ""}
                      onChange={(e) => handleChange("contact_email", e.target.value)}
                      placeholder="support@glambook.com"
                      className="pl-9 text-base md:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                    Support Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      value={settings.contact_phone || ""}
                      onChange={(e) => handleChange("contact_phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      className="pl-9 text-base md:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                  Office / Registered Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={settings.office_address || ""}
                    onChange={(e) => handleChange("office_address", e.target.value)}
                    placeholder="Bandra West, Mumbai, Maharashtra 400050"
                    className="pl-9 text-base md:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                  Logo Image URL (Optional)
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="url"
                    value={settings.logo_url || ""}
                    onChange={(e) => handleChange("logo_url", e.target.value)}
                    placeholder="https://glambook.com/logo.png"
                    className="pl-9 text-base md:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security & Lead Privacy Tab */}
          {activeTab === "security" && (
            <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-5">
              <h3 className="font-serif font-bold text-lg text-[#1e1a19]">
                Lead Privacy & Security Safeguards
              </h3>

              <div className="p-4 rounded-xl bg-[#fcf1ef] border border-[#fcdadb] flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#eb7583] shrink-0 mt-0.5" />
                <div className="text-xs text-[#1e1a19] leading-relaxed">
                  <p className="font-semibold text-sm">GlamBook Lead Privacy Guarantee</p>
                  <p className="mt-0.5 text-neutral-600">
                    Client contact information (phone number and email address) is strictly
                    restricted to Administrator access. Under no circumstances are contact details
                    exposed to artist portals or public APIs.
                  </p>
                </div>
              </div>

              {/* Toggles */}
              <div className="divide-y divide-border/60">
                <div className="py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#1e1a19]">
                      Enforce Lead Privacy Masking
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Automatically mask contact details in inquiries and artist booking feeds
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.lead_privacy_mode === "true"}
                      onChange={() => handleToggle("lead_privacy_mode")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#eb7583]"></div>
                  </label>
                </div>

                <div className="py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#1e1a19]">
                      Require Email Verification for Inquiries
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Clients must verify their email address before sending booking requests
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.require_email_verification === "true"}
                      onChange={() => handleToggle("require_email_verification")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#eb7583]"></div>
                  </label>
                </div>

                <div className="py-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                    Lead History Retention (Days)
                  </label>
                  <Input
                    type="number"
                    min={30}
                    value={settings.booking_lead_retention_days || "365"}
                    onChange={(e) =>
                      handleChange("booking_lead_retention_days", e.target.value)
                    }
                    className="max-w-xs text-base md:text-sm"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Number of days booking records remain archived in administrator history
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SEO & Social Links Tab */}
          {activeTab === "social_seo" && (
            <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-5">
              <h3 className="font-serif font-bold text-lg text-[#1e1a19]">
                SEO Meta Tags & Social Channels
              </h3>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                  Default Platform Meta Title
                </label>
                <Input
                  type="text"
                  value={settings.default_meta_title || ""}
                  onChange={(e) => handleChange("default_meta_title", e.target.value)}
                  placeholder="GlamBook — Curated Makeup Artists & Photographers"
                  className="text-base md:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                  Default Platform Meta Description
                </label>
                <textarea
                  rows={3}
                  value={settings.default_meta_description || ""}
                  onChange={(e) =>
                    handleChange("default_meta_description", e.target.value)
                  }
                  placeholder="Discover and book verified bridal makeup artists, hair stylists, and wedding photographers across India."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input focus:border-[#eb7583] focus:ring-1 focus:ring-[#eb7583] outline-hidden text-base md:text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                    Instagram Profile URL
                  </label>
                  <Input
                    type="url"
                    value={settings.instagram_url || ""}
                    onChange={(e) => handleChange("instagram_url", e.target.value)}
                    placeholder="https://instagram.com/glambook"
                    className="text-base md:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                    Facebook Page URL
                  </label>
                  <Input
                    type="url"
                    value={settings.facebook_url || ""}
                    onChange={(e) => handleChange("facebook_url", e.target.value)}
                    placeholder="https://facebook.com/glambook"
                    className="text-base md:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                    YouTube Channel URL
                  </label>
                  <Input
                    type="url"
                    value={settings.youtube_url || ""}
                    onChange={(e) => handleChange("youtube_url", e.target.value)}
                    placeholder="https://youtube.com/@glambook"
                    className="text-base md:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                    Pinterest URL
                  </label>
                  <Input
                    type="url"
                    value={settings.pinterest_url || ""}
                    onChange={(e) => handleChange("pinterest_url", e.target.value)}
                    placeholder="https://pinterest.com/glambook"
                    className="text-base md:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-end bg-white p-4 rounded-2xl border border-border shadow-xs">
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#eb7583] hover:bg-[#d66371] text-white rounded-xl h-11 px-8 shadow-sm font-medium flex items-center gap-2"
            >
              {saving ? (
                <span>Saving Settings...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
