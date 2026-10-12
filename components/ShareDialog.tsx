"use client";

import React, { useState, useEffect } from "react";
import LZString from "lz-string";
import { TripPlan } from "@/lib/providers/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  X,
  Copy,
  Share2,
  Check,
  QrCode,
  Send,
  Mail
} from "lucide-react";

interface ShareDialogProps {
  trip: TripPlan;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareDialog({ trip, isOpen, onClose }: ShareDialogProps) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;

    try {
      // Prepare compact JSON if needed
      let json = JSON.stringify(trip);
      let compressed = LZString.compressToEncodedURIComponent(json);

      if (compressed.length > 6000) {
        // Strip heavy arrays
        const strippedTrip: TripPlan = {
          ...trip,
          stays: trip.stays?.map((s) => ({
            ...s,
            images: s.images.slice(0, 1),
            reviewSnippets: []
          })),
          restaurants: trip.restaurants?.map((r) => ({
            ...r,
            images: r.images.slice(0, 1),
            reviewSnippets: []
          })),
          itinerary: trip.itinerary.map((d) => ({
            ...d,
            activities: d.activities.map((a) => ({
              ...a,
              photo_url: undefined
            }))
          }))
        };
        json = JSON.stringify(strippedTrip);
        compressed = LZString.compressToEncodedURIComponent(json);
      }

      const fullUrl = `${window.location.origin}/share#${compressed}`;
      setShareUrl(fullUrl);
    } catch (e) {
      console.error("Compression error:", e);
      setShareUrl(window.location.href);
    }
  }, [isOpen, trip]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Share link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${trip.destination} Trip Plan`,
          text: `Check out my ${trip.duration} itinerary for ${trip.destination} on Tripli!`,
          url: shareUrl
        });
      } catch (err) {
        // User canceled or failed
      }
    } else {
      handleCopy();
    }
  };

  const shareText = `Check out my ${trip.duration} itinerary for ${trip.destination} on Tripli: ${shareUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(`${trip.destination} Trip Itinerary`)}&body=${encodeURIComponent(shareText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10 border border-gray-100">
        <div className="flex items-center justify-between pb-3 border-b mb-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg text-gray-900">Share Trip Plan</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          This share link encodes your entire trip securely into the URL hash, so no account or server storage is required.
        </p>

        {/* Copy Link Row */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 font-mono truncate"
          />
          <Button size="sm" onClick={handleCopy} className="gap-1.5 shrink-0 text-xs">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy Link"}
          </Button>
        </div>

        {/* Share Action Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {typeof navigator !== "undefined" && "share" in navigator && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleNativeShare}
              className="text-xs gap-1"
            >
              <Share2 className="w-3.5 h-3.5" /> Web Share
            </Button>
          )}

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs gap-1 text-emerald-700 hover:bg-emerald-50"
            >
              <Send className="w-3.5 h-3.5" /> WhatsApp
            </Button>
          </a>

          <a href={emailUrl} className="w-full">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs gap-1 text-blue-700 hover:bg-blue-50"
            >
              <Mail className="w-3.5 h-3.5" /> Email
            </Button>
          </a>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowQr(!showQr)}
            className="text-xs gap-1 text-purple-700 hover:bg-purple-50"
          >
            <QrCode className="w-3.5 h-3.5" /> {showQr ? "Hide QR" : "QR Code"}
          </Button>
        </div>

        {/* QR Code Container (under 30 lines) */}
        {showQr && (
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200 mb-2">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}`}
              alt="Trip QR Code"
              className="w-36 h-36 rounded-lg shadow-xs bg-white p-1"
            />
            <span className="text-[11px] text-gray-500 mt-2">Scan with phone camera to open</span>
          </div>
        )}
      </div>
    </div>
  );
}
